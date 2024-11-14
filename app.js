const searchInput = document.querySelector('.search-input')
const searchList = document.querySelector('.autocomplete-list')
const repoList = document.querySelector('.repo-list')

function debounce(func, delay) {
	let timeout
	return (...args) => {
		clearTimeout(timeout)
		timeout = setTimeout(() => func(...args), delay)
	}
}

async function fetchRepos(query) {
	if (!query.trim()) return
	try {
		const response = await fetch(
			`https://api.github.com/search/repositories?q=${query}&per_page=5`
		)
		const data = await response.json()
		return data.items || []
	} catch (error) {
		console.error('Ошибка запроса данных:', error)
	}
}

function renderAutocomplete(repos) {
	searchList.innerHTML = ''
	repos.forEach(repo => {
		const itemHTML = `
			<div class="autocomplete-list__item" data-id="${repo.id}" data-name="${repo.name}" data-owner="${repo.owner.login}" data-stars="${repo.stargazers_count}">
				${repo.name}
      	</div>
		`
		searchList.insertAdjacentHTML('beforeend', itemHTML)
	})
}

function addRepoToList(repo) {
	const repoItemHTML = `
		<li class="repo-item">
			<div class="item-body">
				<p>Репозиторий: ${repo.name}</p>
				<p>Автор: ${repo.owner}</p>
				<p>⭐ ${repo.stars}</p>
			</div>
      	<button class="remove-item">×</button>
    	</li>
	`
	repoList.insertAdjacentHTML('beforeend', repoItemHTML)
}

searchInput.addEventListener(
	'input',
	debounce(async () => {
		const query = searchInput.value
		const repos = await fetchRepos(query)
		renderAutocomplete(repos)
	}, 400)
)

searchList.addEventListener('click', event => {
	if (event.target.classList.contains('autocomplete-list__item')) {
		const repo = {
			id: event.target.dataset.id,
			name: event.target.dataset.name,
			owner: event.target.dataset.owner,
			stars: event.target.dataset.stars
		}
		addRepoToList(repo)
		searchInput.value = ''
		searchList.innerHTML = ''
	}
})

repoList.addEventListener('click', event => {
	if (event.target.classList.contains('remove-item')) {
		event.target.parentElement.remove()
	}
})
