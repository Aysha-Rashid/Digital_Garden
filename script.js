document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.querySelector(".field-canvas");
    const ctx = canvas.getContext("2d");

    const tileSize = 50;
    const rows = 10;
    const cols = 10;
    const borderPadding = 1;

    canvas.width = (cols + 2 * borderPadding) * tileSize;
    canvas.height = (rows + 2 * borderPadding) * tileSize;

    // Load images for different states
    const grassImg = new Image();
    const borderImg = new Image();
    const emptyFieldImg = new Image();
    const sproutingImg = new Image();
    const maturePlantImg = new Image();

    grassImg.src = "assets/grass_texture.png"; 
    borderImg.src = "assets/border_texture.png";
    emptyFieldImg.src = "assets/empty_field.png"; 
    sproutingImg.src = "assets/sprouting.png"; 
    maturePlantImg.src = "assets/mature_plant.png"; 

    let imagesLoaded = 0;
    const totalImages = 5;
    const fieldState = Array(rows).fill().map(() => Array(cols).fill(0));

    function onImageLoad() {
        imagesLoaded++;
        if (imagesLoaded === totalImages) drawField();
    }

    grassImg.onload = onImageLoad;
    borderImg.onload = onImageLoad;
    emptyFieldImg.onload = onImageLoad;
    sproutingImg.onload = onImageLoad;
    maturePlantImg.onload = onImageLoad;

    function drawField() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const state = fieldState[y][x];
                let tileImg, fallbackColor;

                if (state === 0) {
                    tileImg = grassImg;
                    fallbackColor = "#00FF00"; 
                } else if (state === 1) {
                    tileImg = emptyFieldImg;
                    fallbackColor = "#8B4513"; 
                } else if (state === 2) {
                    tileImg = sproutingImg;
                    fallbackColor = "#90EE90"; 
                } else if (state === 3) {
                    tileImg = maturePlantImg;
                    fallbackColor = "#FFD700"; 
                }

                const xPos = (x + borderPadding) * tileSize;
                const yPos = (y + borderPadding) * tileSize;

                if (tileImg.complete && tileImg.naturalWidth !== 0) {
                    ctx.drawImage(tileImg, xPos, yPos, tileSize, tileSize);
                } else {
                    ctx.fillStyle = fallbackColor;
                    ctx.fillRect(xPos, yPos, tileSize, tileSize);
                    ctx.strokeStyle = "#000000";
                    ctx.strokeRect(xPos, yPos, tileSize, tileSize);
                }
            }
        }

        for (let x = 0; x < canvas.width / tileSize; x++) {
            const topX = x * tileSize;
            const bottomY = (canvas.height / tileSize - 1) * tileSize;
            if (borderImg.complete && borderImg.naturalWidth !== 0) {
                ctx.drawImage(borderImg, topX, 0, tileSize, tileSize);
                ctx.drawImage(borderImg, topX, bottomY, tileSize, tileSize);
            } else {
                ctx.fillStyle = "#8B5A2B";
                ctx.fillRect(topX, 0, tileSize, tileSize);
                ctx.fillRect(topX, bottomY, tileSize, tileSize);
            }
        }

        for (let y = 0; y < rows + 2 * borderPadding; y++) {
            ctx.drawImage(borderImg, 0, y * tileSize, tileSize, tileSize);
            ctx.drawImage(borderImg, (cols + 1) * tileSize, y * tileSize, tileSize, tileSize);
        }
    }

    canvas.addEventListener("click", (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const tileX = Math.floor((mouseX - borderPadding * tileSize) / tileSize);
        const tileY = Math.floor((mouseY - borderPadding * tileSize) / tileSize);

        if (tileX >= 0 && tileX < cols && tileY >= 0 && tileY < rows) {
            const currentState = fieldState[tileY][tileX];
            const currentCursor = document.body.className;
            let newState = currentState;

            if (currentCursor === "cursor-shovel" && currentState === 0) {
                newState = 1;
            } else if (currentCursor === "cursor-seeds" && currentState === 1) {
                newState = 2;
            } else if (currentCursor === "cursor-water" && currentState === 2) {
                newState = 3;
            } else {
                return;
            }

            if (newState !== currentState) {
                fieldState[tileY][tileX] = newState;
                drawField();
            }
        }
    });

    let subtasks = [];
    const cursorEmojis = ['cursor-shovel', 'cursor-seeds', 'cursor-water'];

    function setMainTask() {
        const mainTaskInput = document.getElementById("main-task-input").value;
        if (mainTaskInput.trim() !== "") {
            document.getElementById("main-task").textContent = mainTaskInput;
            document.getElementById("main-task-input").value = "";
        }
    }

    function addSubtask() {
        const subtaskInput = document.getElementById("subtask-input").value;
        if (subtaskInput.trim() !== "") {
            subtasks.push({ text: subtaskInput, checked: false });
            updateSubtaskList();
            document.getElementById("subtask-input").value = "";
        }
    }

    function updateSubtaskList() {
        const subtaskList = document.getElementById("subtask-list");
        subtaskList.innerHTML = "";
        subtasks.forEach((subtask, index) => {
            const li = document.createElement("li");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = subtask.checked;
            checkbox.addEventListener("change", () => {
                subtasks[index].checked = checkbox.checked;
                updateCursor();
            });

            const label = document.createElement("label");
            label.textContent = `${index + 1}. ${subtask.text}`;
            li.appendChild(checkbox);
            li.appendChild(label);
            subtaskList.appendChild(li);
        });
        updateCursor();
    }

    function updateCursor() {
        const checkedCount = subtasks.filter(subtask => subtask.checked).length;
        if (checkedCount === 0) {
            document.body.className = 'cursor-default';
        } else {
            const cursorIndex = (checkedCount - 1) % cursorEmojis.length;
            document.body.className = cursorEmojis[cursorIndex];
        }
    }

    function selectPlant(plant) {
        document.getElementById("selected-plant").textContent = plant;
        console.log(`Selected plant: ${plant}`);
    }

    window.setMainTask = setMainTask;
    window.addSubtask = addSubtask;
    window.selectPlant = selectPlant;
});
