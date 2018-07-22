const floor = document.getElementById('floor')

const floorPosition = {
  top: floor.clientTop,
  left: floor.clientLeft,
  right: floor.clientLeft + floor.offsetWidth,
  bottom: floor.clientTop + floor.offsetHeight
}

const rooms = []

function addRoom(text) {
  const room = document.createElement('div')
  room.textContent = text
  room.className = 'room'
  room.style.width = '50%'
  room.style.width = '50%'
  room.setAttribute('id', 'room' + rooms.length)
  document.getElementById('floor').appendChild(room)
  makeDraggable(room)
  rooms.push(room)
}

function getRoomCoordinates(room) {
  return room.getBoundingClientRect();
}

function wouldBeHittingOtherRoom(roomRect){
  const x1 = roomRect.left
  const y1 = roomRect.top
  const b1 = roomRect.bottom
  const r1 = roomRect.right
  let wouldHit = false
  const margin = 5
  rooms.map(room => {
    if (room.id === roomRect.id ) return
    const r = getRoomCoordinates(room)    
    const x2 = r.left - margin;
    const y2 = r.top - margin;
    const b2 = r.bottom + margin;
    const r2 = r.right + margin;

    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;

    wouldHit = true;

  })

  return wouldHit
}

function makeDraggable(element) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0
  element.onmousedown = dragMouseDown

  function inDraggableArea(e) {
    const { top, bottom, left, right } = getRoomCoordinates(element)
    const x = e.clientX
    const y = e.clientY
    return y > top && y < (bottom - 10) && x > left && x < (right - 20)
  }

  function dragMouseDown(e) {
    e = e || window.event
    if(!inDraggableArea(e)) return
    e.preventDefault()
    // get the mouse cursor position at startup:
    pos3 = e.clientX
    pos4 = e.clientY
    document.onmouseup = closeDragElement
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag
  }

  function elementDrag(e) {
    e = e || window.event
    e.preventDefault()

    // calculate the new cursor position:
    const p1 = pos3 - e.clientX
    const p2 = pos4 - e.clientY

    const whereItWouldBe = getRoomCoordinates(element)  
    whereItWouldBe.top = (element.offsetTop - p1)
    whereItWouldBe.left = (element.offsetLeft - p2)
    whereItWouldBe.id = element.id

    console.log(`wouldBeHittingOtherRoom = ${wouldBeHittingOtherRoom(whereItWouldBe)}`)
    if (wouldBeHittingOtherRoom(whereItWouldBe)) return
    
    pos1 = p1
    pos2 = p2
    pos3 = e.clientX
    pos4 = e.clientY

    // set the element's new position:
    element.style.top = (element.offsetTop - pos2) + "px"
    element.style.left = (element.offsetLeft - pos1) + "px"
  }

  function closeDragElement() {
    /// stop moving when mouse button is released
    document.onmouseup = null
    document.onmousemove = null
  }

}