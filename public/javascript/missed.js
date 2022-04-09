async function newMissedHandler(event) {
  event.preventDefault();

  const name = document.querySelector("#missed").value.trim();
  const pd_location = document.querySelector("#location").value.trim();
  const item_category = document.querySelector("#category").value.trim();
  const wedding_date = document.querySelector("#wedding-date").value.trim();
  const platform_place = document.querySelector("#platform-site").value.trim();
  const notes = document.querySelector("#notes").value.trim();

  const response = await fetch(`/api/missed`, {
    method: "POST",
    body: JSON.stringify({
      name,
      pd_location,
      item_category,
      wedding_date,
      platform_place,
      notes,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    document.location.replace("/inventory");
  } else {
    alert(response.statusText);
  }
}

document
  .querySelector(".new-missed")
  .addEventListener("submit", newMissedHandler);
