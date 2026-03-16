// Trexzactyl Software. (https://Trexzactyl.com)
// Green: #189a1c
// Gray: hsl(211, 22%, 21%)

console.log(Trexzactyl);

const suspended = Trexzactyl.suspended;
const active = Trexzactyl.servers.length - Trexzactyl.suspended;
const freeDisk = Trexzactyl.diskTotal - Trexzactyl.diskUsed;
const freeMemory = Trexzactyl.memoryTotal - Trexzactyl.memoryUsed;

const diskChart = new Chart($("#disk_chart"), {
    type: "pie",
    data: {
        labels: ["Free Disk", "Used Disk"],
        datasets: [{
            backgroundColor: ["#189a1c", "hsl(211, 22%, 21%)"],
            data: [freeDisk, Trexzactyl.diskUsed]
        }]
    }
});

const ramChart = new Chart($("#ram_chart"), {
    type: "pie",
    data: {
        labels: ["Free RAM", "Used RAM"],
        datasets: [{
            backgroundColor: ["#189a1c", "hsl(211, 22%, 21%)"],
            data: [freeMemory, Trexzactyl.memoryUsed]
        }]
    }
});

const serversChart = new Chart($("#servers_chart"), {
    type: "pie",
    data: {
        labels: ["Active Servers", "Suspended Servers"],
        datasets: [{
            backgroundColor: ["#189a1c", "hsl(211, 22%, 21%)"],
            data: [active, suspended]
        }]
    }
});
