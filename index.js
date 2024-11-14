/**
 *
 * @typedef {"tmp" | "swap" | "reset"} TypeOfHighlight
 */

const graphContainer = document.getElementById("graph-container");

document.querySelectorAll("[data-sort]").forEach((btn) => {
  const typ = btn.getAttribute("data-sort");

  btn.addEventListener("click", () => {
    switch (typ) {
      case "shell":
        shellSort(Array.from(graphContainer.children));
        break;
    }
  });
});

document.getElementById("randomize").addEventListener("click", () => {
  graphContainer.innerHTML = "";

  for (let i = 0; i < 25; ++i) {
    const div = document.createElement("div");

    div.style.setProperty("--_value", random(1, 100) + "%");

    graphContainer.appendChild(div);
  }
});

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function updateShellSortMetadata(i, j, gap, currPass) {
  const metadata = document.getElementById("metadata");

  metadata.innerHTML = "";

  const iDiv = document.createElement("div");
  const jDiv = document.createElement("div");
  const gapDiv = document.createElement("div");
  const currPassDiv = document.createElement("div");

  iDiv.textContent = "i: " + i;
  jDiv.textContent = "j: " + j;
  gapDiv.textContent = "gap: " + gap;
  currPassDiv.textContent = "current pass: " + currPass;

  metadata.appendChild(iDiv);
  metadata.appendChild(jDiv);
  metadata.appendChild(gapDiv);
  metadata.appendChild(currPassDiv);
}

/**
 *
 * @param {HTMLElement[]} arr
 */
async function shellSort(arr) {
  const arrLength = arr.length;
  let currentPass = 1;

  for (
    let gap = Math.floor(arrLength / 2);
    gap > 0;
    gap = Math.floor(gap / 2)
  ) {
    updateShellSortMetadata(-1, -1, gap, currentPass);

    for (let i = gap; i < arrLength; ++i) {
      const tmp = arr[i];
      const tmpValue = getDataValue(tmp);

      highlightEl(tmp, "tmp");

      await wait(250);

      let j = i;

      updateShellSortMetadata(i, j, gap, currentPass);

      for (; j >= gap; j -= gap) {
        const el1 = arr[j];
        const el2 = arr[j - gap];
        const el2Val = getDataValue(el2);

        if (el2Val <= tmpValue) {
          break;
        }

        if (i != j) {
          highlightEl(el1, "swap");
        }

        highlightEl(el2, "swap");

        await wait(250);

        arr[j].style.setProperty("--_value", el2Val + "%");

        await wait(250);

        if (i != j) {
          highlightEl(el1, "reset");
        }

        highlightEl(el2, "reset");

        await wait(250);

        updateShellSortMetadata(i, j, gap, currentPass);
      }

      highlightEl(arr[j], "swap");
      highlightEl(tmp, "swap");

      await wait(250);

      arr[j].style.setProperty("--_value", tmpValue + "%");

      highlightEl(arr[j], "reset");
      highlightEl(tmp, "reset");

      await wait(250);
    }

    currentPass += 1;

    updateShellSortMetadata(-1, -1, gap, currentPass);
  }
}

/**
 *
 * @param {HTMLElement} el
 * @returns {number}
 */
function getDataValue(el) {
  return +getComputedStyle(el).getPropertyValue("--_value").split("%")[0];
}

/**
 *
 * @param {HTMLElement} el
 * @param {TypeOfHighlight} typ
 *
 */
function highlightEl(el, typ) {
  switch (typ) {
    case "swap":
      {
        el.classList.remove("tmp");
        el.classList.add("swap");
      }
      break;
    case "tmp":
      {
        el.classList.remove("swap");
        el.classList.add("tmp");
      }
      break;
    case "reset":
      {
        el.classList.remove("swap", "tmp");
      }
      break;
    default:
      throw new Error("Invalid typ passed for highlight");
  }
}

/**
 *
 * @param {number} duration
 * @returns {Promise<void>}
 */
function wait(duration) {
  return new Promise((res) => setTimeout(res, duration));
}
