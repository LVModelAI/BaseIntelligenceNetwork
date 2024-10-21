let alertCount = 0; // Counter for active alerts
const maxAlerts = 10;

export const showAlert = (message: string, type: 'success' | 'error') => {
    // Check if the limit is reached
    if (alertCount >= maxAlerts) {
        // console.log(`Cannot add alert. Active alerts: ${alertCount}`);
        return;
    }

    // Increment counter only if a new alert is being created
    alertCount++; 
    // console.log(`Active alerts: ${alertCount}`); // Log current alert count

    const alertDiv = document.createElement("div");
    alertDiv.className = "alert-div fixed bg-[#f7f9fc] left-1/2 -translate-x-1/2 z-[105] transition-[top] duration-300 rounded-lg p-2 text-xs md:text-sm text-[#171C26] font-coinbase cursor-default border border-[#A1A9B8] w-[90%] md:w-auto alert-enter-active";

    // Set the top position based on the current alert count
    alertDiv.style.top = `${16 + (alertCount - 1) * 56}px`; // Adjust spacing as needed

    const closeButton = document.createElement("button");
    closeButton.innerHTML = "&times;";
    closeButton.className = "w-8 text-[#787878] text-2xl font-coinbase hover:text-black border-0 hover:border border-[#A1A9B8] rounded-md";
    closeButton.onclick = () => {
        alertDiv.classList.add("alert-exit-active");
        setTimeout(() => {
            alertDiv.remove();
            alertCount--; // Decrement counter on alert removal
            // Ensure alertCount does not go negative
            if (alertCount < 0) alertCount = 0; 
            console.log(`Active alerts: ${alertCount}`); // Log updated alert count
            // Re-position remaining alerts
            repositionAlerts();
        }, 500);
    };

    const messageSpan = document.createElement("div");
    messageSpan.textContent = message;
    messageSpan.className = "font-coinbase font-bold mx-3.5";

    const contentDiv = document.createElement("div");
    contentDiv.className = "flex items-center justify-between w-full";

    if (type === "error") {
        const rectangle = document.createElement("div");
        rectangle.className = "flex items-center rounded-lg p-1.5 relative left-[0]";

        const circle = document.createElement("div");
        circle.className = "w-[22px] h-[22px] border border-[#EEB115] text-[#EEB115] flex items-center justify-center font-coinbase rounded-full border-2";
        circle.innerHTML = "!";

        rectangle.appendChild(circle);
        contentDiv.appendChild(rectangle);
    } else if (type === "success") {
        const rectangle = document.createElement("div");
        rectangle.className = "flex items-center rounded-lg p-1.5 relative left-[0]";

        const circle = document.createElement("div");
        circle.className = "w-[22px] h-[22px] border border-[#23B128] text-[#23B128] flex items-center justify-center font-coinbase rounded-full border-2";
        circle.innerHTML = "&#10003;";
        
        rectangle.appendChild(circle);
        contentDiv.appendChild(rectangle);
    }

    contentDiv.appendChild(messageSpan);
    contentDiv.appendChild(closeButton);

    alertDiv.appendChild(contentDiv);
    document.getElementById("main-container")?.appendChild(alertDiv);

    void alertDiv.offsetWidth; // Trigger a reflow to restart the CSS animation

    alertDiv.classList.add("alert-enter-active");

    // Auto close alert after 3 seconds
    setTimeout(() => {
        closeButton.click();
    }, 3000);
};

// Function to reposition alerts after one is removed
const repositionAlerts = () => {
    const alerts = document.querySelectorAll<HTMLElement>('#main-container .alert-div');
    alerts.forEach((alert, index) => {
        alert.style.top = `${16 + index * 56}px`; // Adjust spacing as needed
    });
};
