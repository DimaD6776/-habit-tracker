'use strict'

let habbits = []
const HABBIT_KEY = 'HABBIT_KEY'
let globalActiveHabbitId

const page = {
    menu: document.querySelector('.menu__list'),
    header: {
        h1: document.querySelector('.h1'),
        progressPercent: document.querySelector('.progress__percent'),
        progressCoverBar: document.querySelector('.progress__cover-bar')
    },
    content: {
        daysContainer: document.getElementById('days'),
        nextDay: document.querySelector('.habbit__day')
    }
}

/* utils */


function loadData(){
    const habbitsString = localStorage.getItem(HABBIT_KEY)
    const habbitArr = JSON.parse(habbitsString)
    if(Array.isArray(habbitArr)){
        habbits = habbitArr
    } else {
        console.log("error")
    }
}

function saveData(){
    localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits))
}


function rerenderMenu(activeHabbit){
    if(!activeHabbit){
        return
    }
    for(const habbit of habbits){
        const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`)
        if(!existed){
            const element = document.createElement('button')
            element.setAttribute('menu-habbit-id', habbit.id)
            element.classList.add('menu__item')
            element.addEventListener('click', () => rerender(habbit.id))
            element.innerHTML = `<img src="./images/${habbit.icon}.svg" alt="${habbit.name}" >`
            if(activeHabbit.id === habbit.id){
                element.classList.add('menu__item_active')
            }
            page.menu.appendChild(element)
            continue
        }   
        if(activeHabbit.id === habbit.id){
            existed.classList.add('menu__item_active')
        } else {
            existed.classList.remove('menu__item_active')
        }
    }
}

function renderHead(activeHabbit){
    if(!activeHabbit){
        return
    }

    page.header.h1.innerText = activeHabbit.name

    const progress = activeHabbit.days.length / activeHabbit.target > 1
        ? 100
        : activeHabbit.days.length / activeHabbit.target * 100
    
    page.header.progressPercent.innerText = progress.toFixed(0) + '%'
    page.header.progressCoverBar.setAttribute('style', `width: ${progress}%`)
    
}


function rerenderContetnt(activeHabbit){
    page.content.daysContainer.innerHTML = ''
    for(const index in activeHabbit.days){
        const element = document.createElement('div')
        element.classList.add('habbit')
        element.innerHTML = ` 
            <div class="habbit__day">День ${Number(index) + 1}</div>
            <div class="habbit__comment">
                ${activeHabbit.days[index].comment}
            </div>
            <button class="habbit__delete" onclick="deleteDays(${index})">
                <img src="./images/delete.svg" alt="Удалить день ${index + 1}">
            </button>
        `
        page.content.daysContainer.appendChild(element)
    }

    page.content.nextDay.innerHTML = `День ${activeHabbit.days.length + 1}`
}
    


function rerender(activeHabbitId){
    globalActiveHabbitId = activeHabbitId
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId) 
    rerenderMenu(activeHabbit)
    renderHead(activeHabbit)
    rerenderContetnt(activeHabbit)
}

function addDays(event){
    const form = event.target
    event.preventDefault()
    const data = new FormData(form)
    const comment = data.get('comment')
    form['comment'].classList.remove('error')
    if(!comment){
        form['comment'].classList.add('error')
    }
    habbits = habbits.map((habbit) => {
        if(habbit.id === globalActiveHabbitId){
            return {
                ...habbit,
                days: habbit.days.concat([{ comment }])
            }
        }
        return habbit
    })
    form['comment'].value = ''
    rerender(globalActiveHabbitId)
    saveData()
}

function deleteDays(index){
    habbits = habbits.map((habbit) => {
        if(habbit.id === globalActiveHabbitId){
            habbit.days.splice(index, 1)
            return {
                ...habbit,
                days: habbit.days
            }
        }
        return habbit
    })
    rerender(globalActiveHabbitId)
    saveData()
}

(() => {
    loadData()
    rerender(habbits[0].id)
})()