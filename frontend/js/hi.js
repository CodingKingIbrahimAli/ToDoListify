import { baseURL } from "./config.js";

const gridContainer = document.getElementById("gridContainer");
const logOut_btn = document.getElementById("logOut");
let accessToken = localStorage.getItem("accessToken");

const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

// Get Tasks
const getTasks = async (token) => {
    try {
        let response = await axiosInstance.get(`/api/v1/task`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        let data = response.data;

        if (data.length === 0) {
            gridContainer.innerHTML = "<p class='text-gray-500 text-center mt-5'>There are no tasks available.</p>";
        } else {
            gridContainer.innerHTML = data.map((task, index) => `
                <div index="${index}" 
                    class="task-container w-full sm:w-[90%] md:w-[609px] min-h-[200px] bg-yellow-500 rounded-[52px] shadow-lg p-5 relative animate-slideIn">

                    <h2 class="absolute text-xl sm:text-2xl md:text-4xl w-fit top-[14px] left-[10%] sm:left-[135px] text-black font-extrabold rounded-lg">
                        ${task.title}
                    </h2>

                    <div class="absolute w-full right-4 flex justify-end gap-4 pr-4 pt-1">
                        <a href="/src/HTML/update_task.html?index=${index}&task-id=${task.id}" class="cursor-pointer text-lg sm:text-xl">
                            <i class="fa-solid fa-pen"></i>
                        </a>
                        <button class="delete_btn cursor-pointer text-lg sm:text-xl" task-id="${task.id}">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>

                    <div class="absolute w-[50px] sm:w-[70px] h-[50px] sm:h-[70px] top-[70px] left-[5%] sm:left-[33px] rounded-full ${getCircleColor(task.state)}"></div>

                    <div class="absolute w-[80%] sm:w-[481px] top-[70px] left-[20%] sm:left-[120px] p-3">
                        <p class="text-sm sm:text-base text-gray-800 break-words">${task.body}</p>
                    </div>

                    <div class="absolute bottom-3 sm:top-[190px] left-[10%] sm:left-[133px] flex flex-wrap gap-2 sm:gap-5">
                        <button class="w-[90px] sm:w-[120px] h-[25px] sm:h-[30px] bg-white text-black text-xs sm:text-[19px] font-black italic rounded-lg">
                            ${getState(task.state)}
                        </button>
                        <button class="w-[90px] sm:w-[120px] h-[25px] sm:h-[30px] bg-white text-black text-xs sm:text-[19px] font-black italic rounded-lg">
                            ${new Date(task.create_at).toISOString().split("T")[0]}
                        </button>
                        <button class="w-[90px] sm:w-[120px] h-[25px] sm:h-[30px] bg-white text-black text-xs sm:text-[19px] font-black italic rounded-lg">
                            ${task.priority}
                        </button>
                    </div>
                </div>
            `).join("");
        }
    } catch (error) {
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                try {
                    const refreshResponse = await axiosInstance.get(`/api/v1/user/refresh`);
                    localStorage.setItem("accessToken", refreshResponse.data.accessToken);
                    accessToken = refreshResponse.data.accessToken;
                    return getTasks(accessToken);
                } catch (refreshError) {
                    if (refreshError.response && refreshError.response.status === 401) {
                        Swal.fire({
                            icon: "error",
                            title: "Session Expired",
                            text: "You have to log in again.",
                            confirmButtonColor: "#d33",
                        }).then(() => {
                            window.location.href = "/src/HTML/welcome.html";
                        });
                    }
                }
            } else if (status === 404) {
                gridContainer.innerHTML = "<p class='text-gray-500 text-center mt-5'>There are no tasks available.</p>";
            } else if (status === 500) {
                Swal.fire({
                    icon: "error",
                    title: "Server Error",
                    text: "Something went wrong. Please try again later.",
                    confirmButtonColor: "#d33",
                });
            }
        } else {
            Swal.fire({
                icon: "error",
                title: "Network Error",
                text: "Please check your internet connection and try again.",
                confirmButtonColor: "#d33",
            });
        }
    }
};

// Call the function initially if token is available
if (accessToken) {
    getTasks(accessToken);
}

// Logout functionality
logOut_btn?.addEventListener("click", () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/src/HTML/welcome.html";
});
