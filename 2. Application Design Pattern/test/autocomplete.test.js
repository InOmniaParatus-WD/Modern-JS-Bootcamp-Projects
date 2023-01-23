// a hook function globally defined by mocha
//the callback func that will attempt to set-up the testing environment for every single test
beforeEach(() => {
  document.querySelector("#target").innerHTML = "";

  createAutocomplete({
    root: document.querySelector("#target"),
    fetchData() {
      return [
        { Title: "The Matrix" },
        { Title: "Not The Matrix" },
        { Title: "Some other movie" },
      ];
    },
    renderOption(movie) {
      return movie.Title;
    },
  });
});

//helper function
const waitFor = (selector) => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (document.querySelector(selector)) {
        clearInterval(interval);
        clearTimeout(timeout);
        resolve();
      }
    }, 30);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      reject();
    }, 2000);
  });
};

it("Dropdown starts closed", () => {
  const dropdown = document.querySelector(".dropdown");
  // unsing 'expect' from chai library function instead of 'if' statements
  expect(dropdown.className).not.to.include("is-active"); // remove '.not' to force the test to fail, for best practice
});

it("After searching, dropdown opens up", async () => {
  const input = document.querySelector("input");
  input.value = "The Matrix";
  input.dispatchEvent(new Event("input"));

  await waitFor(".dropdown-item");

  const dropdown = document.querySelector(".dropdown");
  expect(dropdown.className).to.include("is-active");
});

it("After searching displays some results", async () => {
  const input = document.querySelector("input");
  input.value = "The Matrix";
  input.dispatchEvent(new Event("input"));

  await waitFor(".dropdown-item");

  const items = document.querySelectorAll(".dropdown-item");
  expect(items.length).to.equal(3);
});
