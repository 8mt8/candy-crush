document.addEventListener('DOMContentLoaded', () => {
const grid = document.querySelector('.grid')
const scoreDisplay = document.getElementById('score')
const width = 8
const squares = []
let score = 0

const candyColors = [
    'url(images/foto_final_1.png)',
    'url(images/foto_final_2.png)',
    'url(images/foto_final_3.png)',
    'url(images/foto_final_4.png)',
    'url(images/foto_final_5.png)',
    'url(images/red-candy.png)'
  ]

//create your board
function createBoard() {
  for (let i = 0; i < width * width; i++) {
    const square = document.createElement('div');
    square.setAttribute('draggable', true);
    square.setAttribute('id', i);
    let randomColor = Math.floor(Math.random() * candyColors.length);
    square.style.backgroundImage = candyColors[randomColor];
    grid.appendChild(square);
    squares.push(square);
  }
}
createBoard();

// Prevent default touch behaviors globally
document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

document.addEventListener('touchstart', function(e) {
    e.preventDefault();
}, { passive: false });

// Prevent double-tap zoom
document.addEventListener('touchend', function(e) {
    e.preventDefault();
}, { passive: false });

let touchStartX, touchStartY, touchEndX, touchEndY;

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    const candy = e.target;
    selectedTile = candy;
    
    // Add active state for visual feedback
    candy.style.opacity = '0.7';
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!selectedTile) return;
    
    const touch = e.touches[0];
    touchEndX = touch.clientX;
    touchEndY = touch.clientY;
}

function handleTouchEnd(e) {
    e.preventDefault();
    if (!selectedTile) return;
    
    // Reset opacity
    selectedTile.style.opacity = '1';
    
    const candy = e.target;
    const coords = candy.id.split("-");
    const r = parseInt(coords[0]);
    const c = parseInt(coords[1]);
    
    // Calculate the direction of the swipe
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Add a minimum swipe distance threshold
    const minSwipeDistance = 30;
    
    if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
        selectedTile = null;
        otherTile = null;
        return;
    }
    
    // Determine if the swipe was horizontal or vertical
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0 && c < 7) {
            // Swipe right
            selectedTile = document.getElementById(r + "-" + c);
            otherTile = document.getElementById(r + "-" + (c + 1));
        } else if (deltaX < 0 && c > 0) {
            // Swipe left
            selectedTile = document.getElementById(r + "-" + c);
            otherTile = document.getElementById(r + "-" + (c - 1));
        }
    } else {
        // Vertical swipe
        if (deltaY > 0 && r < 7) {
            // Swipe down
            selectedTile = document.getElementById(r + "-" + c);
            otherTile = document.getElementById((r + 1) + "-" + c);
        } else if (deltaY < 0 && r > 0) {
            // Swipe up
            selectedTile = document.getElementById(r + "-" + c);
            otherTile = document.getElementById((r - 1) + "-" + c);
        }
    }
    
    if (selectedTile && otherTile) {
        const selectedCoords = selectedTile.id.split("-");
        const otherCoords = otherTile.id.split("-");
        
        const selectedR = parseInt(selectedCoords[0]);
        const selectedC = parseInt(selectedCoords[1]);
        const otherR = parseInt(otherCoords[0]);
        const otherC = parseInt(otherCoords[1]);
        
        // Swap the candies
        const temp = squares[selectedR * width + selectedC].style.backgroundImage;
        squares[selectedR * width + selectedC].style.backgroundImage = squares[otherR * width + otherC].style.backgroundImage;
        squares[otherR * width + otherC].style.backgroundImage = temp;
        
        // Check for matches
        if (!checkForMatches()) {
            // If no matches, swap back
            const temp = squares[selectedR * width + selectedC].style.backgroundImage;
            squares[selectedR * width + selectedC].style.backgroundImage = squares[otherR * width + otherC].style.backgroundImage;
            squares[otherR * width + otherC].style.backgroundImage = temp;
        }
    }
    
    selectedTile = null;
    otherTile = null;
}

// Helper to swap two squares
function swapSquares(id1, id2) {
    const temp = squares[id1].style.backgroundImage;
    squares[id1].style.backgroundImage = squares[id2].style.backgroundImage;
    squares[id2].style.backgroundImage = temp;
}

// Helper: check for row of three
function isRowOfThree() {
    for (let i = 0; i < 61; i++) {
        let rowOfThree = [i, i+1, i+2];
        let decidedColor = squares[i].style.backgroundImage;
        const decidedImage = decidedColor.replace(/url\("|"\)/g, '').split('/').pop();
        const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
        if (notValid.includes(i)) continue;
        if(rowOfThree.every(index => {
            const currentImage = squares[index].style.backgroundImage.replace(/url\("|"\)/g, '').split('/').pop();
            const isBlank = currentImage === '' || currentImage === undefined;
            return currentImage === decidedImage && !isBlank;
        })) return true;
    }
    return false;
}

// Helper: check for column of three
function isColumnOfThree() {
    for (let i = 0; i < 47; i++) {
        let columnOfThree = [i, i+width, i+width*2];
        let decidedColor = squares[i].style.backgroundImage;
        const decidedImage = decidedColor.replace(/url\("|"\)/g, '').split('/').pop();
        if(columnOfThree.every(index => {
            const currentImage = squares[index].style.backgroundImage.replace(/url\("|"\)/g, '').split('/').pop();
            const isBlank = currentImage === '' || currentImage === undefined;
            return currentImage === decidedImage && !isBlank;
        })) return true;
    }
    return false;
}

// Helper: check for row of four
function isRowOfFour() {
    for (let i = 0; i < 60; i++) {
        let rowOfFour = [i, i+1, i+2, i+3];
        let decidedColor = squares[i].style.backgroundImage;
        const decidedImage = decidedColor.replace(/url\("|"\)/g, '').split('/').pop();
        const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55];
        if (notValid.includes(i)) continue;
        if(rowOfFour.every(index => {
            const currentImage = squares[index].style.backgroundImage.replace(/url\("|"\)/g, '').split('/').pop();
            const isBlank = currentImage === '' || currentImage === undefined;
            return currentImage === decidedImage && !isBlank;
        })) return true;
    }
    return false;
}

// Helper: check for column of four
function isColumnOfFour() {
    for (let i = 0; i < 39; i++) {
        let columnOfFour = [i, i+width, i+width*2, i+width*3];
        let decidedColor = squares[i].style.backgroundImage;
        const decidedImage = decidedColor.replace(/url\("|"\)/g, '').split('/').pop();
        if(columnOfFour.every(index => {
            const currentImage = squares[index].style.backgroundImage.replace(/url\("|"\)/g, '').split('/').pop();
            const isBlank = currentImage === '' || currentImage === undefined;
            return currentImage === decidedImage && !isBlank;
        })) return true;
    }
    return false;
}

// Update matchExists to use helpers
function matchExists() {
    return isRowOfThree() || isColumnOfThree() || isRowOfFour() || isColumnOfFour();
}

function dragDrop() {
    colorBeingReplaced = this.style.backgroundImage;
    squareIdBeingReplaced = parseInt(this.id);
    // Do not swap here!
}

function dragEnd() {
    isDragging = false;
    let validMoves = [squareIdBeingDragged -1 , squareIdBeingDragged -width, squareIdBeingDragged +1, squareIdBeingDragged +width];
    let validMove = validMoves.includes(squareIdBeingReplaced);
    if (squareIdBeingDragged !== null && squareIdBeingReplaced !== null && validMove) {
        swapSquares(squareIdBeingDragged, squareIdBeingReplaced);
        if (!matchExists()) {
            swapSquares(squareIdBeingDragged, squareIdBeingReplaced); // revert immediately
            squares[squareIdBeingDragged].style.animation = 'shake 0.3s';
            setTimeout(() => squares[squareIdBeingDragged].style.animation = '', 300);
        }
    }
    squareIdBeingDragged = null;
    squareIdBeingReplaced = null;
}

//drop candies once some have been cleared
function moveIntoSquareBelow() {
    let moved = true;
    while (moved) {
        moved = false;
        for (i = 0; i < 55; i ++) {
            if(squares[i + width].style.backgroundImage === '') {
                squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
                squares[i].style.backgroundImage = '';
                moved = true;
                const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
                const isFirstRow = firstRow.includes(i);
                if (isFirstRow && (squares[i].style.backgroundImage === '')) {
                  let randomColor = Math.floor(Math.random() * candyColors.length);
                  squares[i].style.backgroundImage = candyColors[randomColor];
                }
            }
        }
    }
}

// Animate removal in all match functions
function animateRemove(index) {
    squares[index].style.transition = 'opacity 0.3s, transform 0.3s';
    squares[index].style.opacity = '0';
    squares[index].style.transform = 'scale(0)';
    setTimeout(() => {
        squares[index].style.backgroundImage = '';
        squares[index].style.opacity = '1';
        squares[index].style.transform = 'scale(1)';
        squares[index].style.transition = '';
    }, 300);
}

// Update all match functions to use animateRemove
function checkRowForFour() {
    for (i = 0; i < 60; i ++) {
      let rowOfFour = [i, i+1, i+2, i+3];
      let decidedColor = squares[i].style.backgroundImage;
      const decidedImage = decidedColor.replace(/url\("|"\)/g, '').split('/').pop();
      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55];
      if (notValid.includes(i)) continue;
      if(rowOfFour.every(index => {
          const currentImage = squares[index].style.backgroundImage.replace(/url\("|"\)/g, '').split('/').pop();
          const isBlank = currentImage === '' || currentImage === undefined;
          return currentImage === decidedImage && !isBlank;
      })) {
        score += 4;
        scoreDisplay.innerHTML = score;
        rowOfFour.forEach(index => {
          animateRemove(index);
        });
      }
    }
  }

function checkColumnForFour() {
    for (i = 0; i < 39; i ++) {
      let columnOfFour = [i, i+width, i+width*2, i+width*3];
      let decidedColor = squares[i].style.backgroundImage;
      const decidedImage = decidedColor.replace(/url\("|"\)/g, '').split('/').pop();
      if(columnOfFour.every(index => {
          const currentImage = squares[index].style.backgroundImage.replace(/url\("|"\)/g, '').split('/').pop();
          const isBlank = currentImage === '' || currentImage === undefined;
          return currentImage === decidedImage && !isBlank;
      })) {
        score += 4;
        scoreDisplay.innerHTML = score;
        columnOfFour.forEach(index => {
          animateRemove(index);
        });
      }
    }
  }

function checkRowForThree() {
    for (i = 0; i < 61; i ++) {
      let rowOfThree = [i, i+1, i+2];
      let decidedColor = squares[i].style.backgroundImage;
      const decidedImage = decidedColor.replace(/url\("|"\)/g, '').split('/').pop();
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
      if (notValid.includes(i)) continue;
      if(rowOfThree.every(index => {
          const currentImage = squares[index].style.backgroundImage.replace(/url\("|"\)/g, '').split('/').pop();
          const isBlank = currentImage === '' || currentImage === undefined;
          return currentImage === decidedImage && !isBlank;
      })) {
        score += 3;
        scoreDisplay.innerHTML = score;
        rowOfThree.forEach(index => {
          animateRemove(index);
        });
      }
    }
  }

function checkColumnForThree() {
    for (i = 0; i < 47; i ++) {
      let columnOfThree = [i, i+width, i+width*2];
      let decidedColor = squares[i].style.backgroundImage;
      const decidedImage = decidedColor.replace(/url\("|"\)/g, '').split('/').pop();
      if(columnOfThree.every(index => {
          const currentImage = squares[index].style.backgroundImage.replace(/url\("|"\)/g, '').split('/').pop();
          const isBlank = currentImage === '' || currentImage === undefined;
          return currentImage === decidedImage && !isBlank;
      })) {
        score += 3;
        scoreDisplay.innerHTML = score;
        columnOfThree.forEach(index => {
          animateRemove(index);
        });
      }
    }
  }

// Checks carried out indefinitely
window.setInterval(() => {
  if (!isDragging) {
    checkRowForFour();
    checkColumnForFour();
    checkRowForThree();
    checkColumnForThree();
    moveIntoSquareBelow();
  }
}, 300);
})
