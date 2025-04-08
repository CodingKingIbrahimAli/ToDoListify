import { baseURL } from "./config.js";

document.addEventListener('DOMContentLoaded', () => {
    const axiosInstance = axios.create({
        baseURL: baseURL,
        withCredentials: true,
    });
    let accessToken = localStorage.getItem("accessToken");

    async function checkLoged() {
        try {
            const refreshResponse = await axiosInstance.get(`/api/v1/user/refresh`);
            localStorage.setItem("accessToken", refreshResponse.data.accessToken);
            setTimeout(()=> {
                window.location.href = "/src/HTML/home.html"
            }, 2500)
        } catch (refreshError) {
            if (refreshError.response && refreshError.response.status === 401) {
                    setTimeout(()=> {
                        window.location.href = "/src/HTML/welcome.html";
                    }, 2500)
                }
                else {
                    Swal.fire({
                        icon: "error",
                        title: "Server Error",
                        text: "Something went wrong. Please try again later.",
                        confirmButtonColor: "#d33"
                    });
                }
            }
        }

    if(accessToken) {
        checkLoged()
    } else {
        setTimeout(()=> {
            window.location.href = "/src/HTML/welcome.html";
        }, 2500)
    }
})

document.addEventListener("DOMContentLoaded", function () {
    // late movement   --   just one second
    setTimeout(() => {
        animateElement("burble-left", 100, 1); // left burble movement 
    }, 1000);

    setTimeout(() => {
        animateElement("burble-right", -100, 1); // right burble movement 
    }, 1500);

    setTimeout(() => {
        fadeInElement("text-container"); // text apperance 
    }, 2000);

    setTimeout(() => {
        slideInElement("underline"); // underline move 
    }, 2500);
});

// function of burbles movement
function animateElement(id, translateX, duration) {
    let element = document.getElementById(id);
    element.style.transition = `opacity ${duration}s ease-out, transform ${duration}s ease-out`;
    element.style.opacity="1";
    element.style.transform = `translateX(${translateX}px)`;
}

// function of text
function fadeInElement(id) {
    let element = document.getElementById(id);
    element.style.transition = "opacity 1s ease-out";
    element.style.opacity = "1";
}

// function of underline
function slideInElement(id) {
    let element = document.getElementById(id);
    element.style.transition = "transform 1s ease-out";
    element.style,transform = "translateX(0)";
}