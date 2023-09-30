let totalPages,
    currentPage = 0,
    loadMoreBtn = document.getElementById("loadMore");

//bind load more button
loadMoreBtn.addEventListener("click", getTeamMembers);

function getTeamMembers() {
    // ignore if all data has been loaded
    if(currentPage >= totalPages) return

    const nextPage = currentPage + 1;

    //check if members are already filtered and set url to use duty filter than
    let url = ''
    let duty = loadMoreBtn.getAttribute('data-filter')
    if (duty !== '') {
        url = `https://challenge-api.view.agentur-loop.com/api.php?page=${nextPage}&limit=5&duty=${duty}`;
    } else {
        url = `https://challenge-api.view.agentur-loop.com/api.php?page=${nextPage}&limit=5`;
    }

    console.log(url)

    fetch(url)
        .then((response) => response.json(), showLoader())
        .then((members) => {
            const users = members.data.data;
            totalPages = members.total_pages;

            //hide load more button
            if(totalPages == nextPage) loadMoreBtn.style.display = 'none';

            //added timeout just for demo purposes, since new members are loaded imedietly
            setTimeout(function () {
                hideloader()
                show(users)
            }, 1500)

            currentPage = nextPage;
        })
        .catch(function (error) {
            console.log(error);
        });
}

// fetch initial members
getTeamMembers();

function show(data) {
    let member = ``;

    for (let item of data) {
        member += `<div class="member p-0">
            <img src="${item.image}" class="img-fluid" alt="${item.name}"/>
            <div class="hidden-content">
                <h5 class="red_text mb-3 text-uppercase"><strong>${item.name}</strong></h5>
                <div class="p_style black_text">Duties: ${item.duties}</div>
            </div>
        </div>`;
    }

    document.getElementById("members").insertAdjacentHTML("beforeend", member);
}

function hideloader() {
    document.getElementById('loader').style.display = 'none';
}

function showLoader() {
    document.getElementById('loader').style.display = 'block';
}


// adding class to navbar when scroll
window.addEventListener('scroll', function() {
    const nav = document.getElementById('navbar')
    if (window.scrollY > 0) {
        nav.classList.add('sticky')
    } else {
        nav.classList.remove('sticky')
    }
})

function filterMembers (e, filter) {
    if (filter === '') {
        e.preventDefault();
        loadMoreBtn.setAttribute('data-filter', '')
        document.getElementById("members").innerHTML = ''
        currentPage = 0
        getTeamMembers()
    } else {
        e.preventDefault();
        loadMoreBtn.setAttribute('data-filter', filter)
        document.getElementById("members").innerHTML = ''
        fetch(`https://challenge-api.view.agentur-loop.com/api.php?page=1&limit=5&duty=${filter}`)
            .then((response) => response.json(), showLoader())
            .then((members) => {
                const users = members.data.data;

                //added timeout just for demo purposes, since new members are loaded imedietly
                setTimeout(function () {
                    hideloader()
                    show(users)
                }, 1500)

            })
            .catch(function (error) {
                console.log(error);
            });
    }
}