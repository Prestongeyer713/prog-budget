let db;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = (event) => {
    event.target.result.createObjectStore("pending", {
      keyPath: "id",
      autoIncrement: true
    });
  };
  
  request.onerror = (err) => {
    console.log(err.message);
  };

function saveRecord(record) {
    const transaction = db.transaction("pending", "readwrite");
    const store = transaction.objectStore("pending");
    store.add(record);
  }

request.onsuccess = function (event) {
        db = event.target.result;
        
        if (navigator.onLine) {
            checkDatabase();
        }
    };


function checkDatabase() {
    const transaction = db.transaction("pending", "readonly");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();
  

    store.add(record);
}

function deletePending() {
    const transaction = db.transaction("pending", "readwrite");
    const store = transaction.objectStore("pending");
    store.clear();
  }

function checkDatabase() {
    const transaction = db.transaction("pending", "readwrite");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then(response => {        
                return response.json();
              })
            .then((response) => response.json())
            .then(() => {
              const transaction = db.transaction("pending", "readwrite");
              const store = transaction.objectStore("pending");
              store.clear();
                });
        }
    };
}

window.addEventListener("online", checkDatabase);