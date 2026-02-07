/**
 *
 * @typedef {"tmp" | "swap" | "reset"} TypeOfHighlight
 */

const graphContainer = document.getElementById("graph-container");

document.querySelectorAll("[data-sort]").forEach((btn) => {
  const typ = btn.getAttribute("data-sort");

  btn.addEventListener("click", async () => {
    if (graphContainer.getAttribute("data-sorting") == "true") {
      return;
    }

    graphContainer.setAttribute("data-sorting", "true");

    switch (typ) {
      case "shell":
        await shellSort(Array.from(graphContainer.children));
        break;
      case "insertion":
        await insertionSort(Array.from(graphContainer.children));
        break;
      case "bubble":
        await bubbleSort(Array.from(graphContainer.children));
        break;
      case "quick sort":
        await quickSort(Array.from(graphContainer.children));
        break;
    }

    graphContainer.removeAttribute("data-sorting", "true");
  });
});

document.getElementById("randomize").addEventListener("click", () => {
  if (graphContainer.getAttribute("data-sorting") == "true") {
    return;
  }

  graphContainer.innerHTML = "";

  for (let i = 0; i < 39; ++i) {
    const div = document.createElement("div");

    div.style.setProperty("--_idx", i);
    div.style.setProperty("--_value", random(1, 100) + "%");

    graphContainer.appendChild(div);
  }
});

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 *
 * @param {HTMLElement} el1
 * @param {HTMLElement} el2
 */
async function swap(el1, el2) {
  const idx = +getComputedStyle(el1).getPropertyValue("--_idx");
  const idx2 = +getComputedStyle(el2).getPropertyValue("--_idx");

  highlightEl(el1, "swap");
  highlightEl(el2, "swap");

  await wait(500);

  el1.style.setProperty("--_idx", idx2);
  el2.style.setProperty("--_idx", idx);

  await wait(1000);

  highlightEl(el1, "reset");
  highlightEl(el2, "reset");
}
let nthPivot = 1;
/**
 *
 * @param {HTMLElement[]} arr
 * @param {number} low
 * @param {number} high
 *
 * Hoare's Partition
 */
async function partition(arr, low, high) {
  let pivot = arr[low];
  const pivotValue = getDataValue(pivot);
  let i = low - 1;
  let j = high + 1;

  pivot.classList.add("tmp");
  const txt = document.createElement("div");
  txt.classList.add("text");
  txt.textContent = "pivot: " + pivotValue + " (" + nthPivot++ + ")";
  pivot.appendChild(txt);

  while (true) {
    highlightEl(pivot, "tmp");
    do {
      i++;
      if (arr[i] === pivot) {
        continue;
      }

      highlightEl(arr[i], "swap");
      await wait(500);
      highlightEl(arr[i], "reset");
    } while (getDataValue(arr[i]) < pivotValue);

    do {
      j--;
      highlightEl(arr[j], "swap");
      await wait(500);
      highlightEl(arr[j], "reset");
    } while (getDataValue(arr[j]) > pivotValue);

    if (i >= j) {
      nthPivot--;
      pivot.classList.remove("tmp");
      pivot.removeChild(txt);

      return j;
    }

    await swap(arr[i], arr[j]);
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
    pivot.removeChild(txt);
    pivot = arr[low];
    pivot.appendChild(txt);
  }
}

/**
 *
 * @param {HTMLElement[]} arr
 * @param {number} low
 * @param {number} high
 * @returns
 */
async function qs(arr, low, high) {
  if (low >= high) {
    return;
  }

  const pivot = await partition(arr, low, high);

  await Promise.all([qs(arr, low, pivot), qs(arr, pivot + 1, high)]);
}

/**
 *
 * @param {HTMLElement[]} arr
 * @returns
 */
async function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  await qs(arr, 0, arr.length - 1);
}

/**
 *
 * @param {HTMLElement[]} arr
 */
async function bubbleSort(arr) {
  const l = arr.length;
  const l2 = l - 1;

  for (let i = 0; i < l2; ++i) {
    for (let j = 0, l3 = l - i - 1; j < l3; ++j) {
      const el1 = arr[j];
      const el2 = arr[j + 1];
      const el1Val = getDataValue(el1);
      const el2Val = getDataValue(el2);

      highlightEl(el1, "swap");
      highlightEl(el2, "swap");

      await wait(250);

      if (el1Val > el2Val) {
        el1.style.setProperty("--_value", el2Val + "%");
        el2.style.setProperty("--_value", el1Val + "%");
      }

      await wait(250);

      highlightEl(el1, "reset");
      highlightEl(el2, "reset");

      await wait(250);
    }
  }
}

/**
 *
 * @param {HTMLElement[]} arr
 */
async function insertionSort(arr) {
  const arrLength = arr.length;

  for (let i = 1; i < arrLength; ++i) {
    const tmp = arr[i];
    const tmpValue = getDataValue(tmp);

    highlightEl(tmp, "tmp");

    await wait(250);

    let j = i - 1;

    while (j >= 0) {
      const curr = arr[j];
      const currValue = getDataValue(curr);

      if (currValue <= tmpValue) {
        break;
      }

      const nextEl = arr[j + 1];

      highlightEl(nextEl, "swap");

      await wait(250);

      nextEl.style.setProperty("--_value", currValue + "%");

      await wait(250);

      highlightEl(curr, "reset");
      highlightEl(nextEl, "reset");

      j -= 1;
    }

    if (j + 1 == i) {
      highlightEl(tmp, "reset");

      await wait(250);
      continue;
    }

    const nextEl = arr[j + 1];

    highlightEl(nextEl, "swap");
    highlightEl(tmp, "swap");

    await wait(250);

    nextEl.style.setProperty("--_value", tmpValue + "%");

    await wait(250);

    highlightEl(nextEl, "reset");
    highlightEl(tmp, "reset");
  }
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

      if (i != j) {
        highlightEl(arr[j], "swap");
        highlightEl(tmp, "swap");

        await wait(250);

        arr[j].style.setProperty("--_value", tmpValue + "%");

        highlightEl(arr[j], "reset");
        highlightEl(tmp, "reset");
      } else {
        highlightEl(tmp, "reset");
      }

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
