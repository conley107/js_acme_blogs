function createElemWithText (name = "p", text = "", className) {
    //    console.log("1. WORKING");
        const created = document.createElement(name);
        created.textContent = text;
        if(className)
        {
            created.classList.add(className);
        }
        return created; 
}

function createSelectOptions(jsonData){
    // console.log("2. WORKING");
    if(!jsonData) return;
    const options = jsonData.map((data) => {
    const holder = document.createElement("option");
    holder.value = data.id;
    holder.textContent = data.name;
    return holder;
    })
    return options;
}

function toggleCommentSection(postId){
     //    console.log("3. WORKING");
    if(!postId) return;
    const sectionEle = document.querySelector(`section[data-post-id="${postId}"]`);
    if(sectionEle) sectionEle.classList.toggle('hide');
    return sectionEle;
}

function toggleCommentButton(postId){
    if(!postId) return;
//    console.log(`4. WORKING`);
    const buttonItem = document.querySelector(`button[data-post-id="${postId}"]`);
    if(!buttonItem) return null;
    if(!buttonItem) return;
    if(buttonItem.textContent === "Show Comments")
    {
        buttonItem.textContent = 'Hide Comments';
    }
    else{
        buttonItem.textContent = 'Show Comments';
    }
    
    return buttonItem;
}

function deleteChildElements(parentElement){
    //    console.log("5. WORKING");
    if(!parentElement) return undefined;
    if(!parentElement?.tagName) return;
    let child = parentElement.lastElementChild;
    while(child)
    {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
    return parentElement;
}

function addButtonListeners(){
    //    console.log("6. WORKING");
    const main = document.querySelector("main");
    const buttons = main.querySelectorAll("button");
    if(!buttons) return;
    buttons.forEach((item) => {
    const postId = item.getAttribute("data-post-id") 
    item.addEventListener("click", function (e) {toggleComments(e, postId)}, false);
    })
    return buttons;
}

function removeButtonListeners(){
    //    console.log("7. WORKING");
    const main = document.querySelector("main");
    const buttons = main.querySelectorAll("button");
    if(!buttons) return;
    buttons.forEach((item) => {
        item.removeEventListener("click",this ,false);
    })
    return buttons;
}

function createComments(data){
//    console.log("8. Working");
    if(!data) return;
    const fragment = document.createDocumentFragment();
    data.forEach((item) => {
        const article = document.createElement("article");
        const h3 = createElemWithText('h3', item.name);
        const firstP = createElemWithText('p', item.body);
        const secondP = createElemWithText('p',`From: ${item.email}`);
        article.append(h3, firstP, secondP);
        fragment.append(article);
    })
    return fragment;
}

function populateSelectMenu(data){
//    console.log("9. Working");
    if(!data) return;
    const selectMenu = document.querySelector("#selectMenu");
    const optionArray = createSelectOptions(data);
    optionArray.forEach((item) => {
        selectMenu.append(item);
    })
    return selectMenu;
}

async function getUsers(){
//    console.log(`10. WORKING`);
    const response = await fetch("https://jsonplaceholder.typicode.com/users")
    const jsonUserData = await response.json();
    return jsonUserData;
}

async function getUserPosts (id){
//    console.log(`11. WORKING`);
    if(!id) return;
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts`)
    const jsonUserData = await response.json();
    const filteredComm = await jsonUserData.filter((data) =>{
        return data.userId === id;
    })
    return filteredComm;
}

async function getUser (id){
//    console.log(`12. WORKING`);
    if(!id) return;
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
    const jsonUserData = await response.json();
    return jsonUserData;
}

async function getPostComments (id){
//    console.log(`13. WORKING`);
    if(!id) return;
    const response = await fetch(`https://jsonplaceholder.typicode.com/comments`)
    const jsonUserData = await response.json();
    const filteredComm = await jsonUserData.filter((data) =>{
        return data.postId === id;
    })
    return filteredComm;
}

async function displayComments(Id) {
//    console.log(`14. WORKING`);
    if (!Id) return;
    const section = document.createElement('section');
    section.setAttribute("data-post-id", Id);
    section.classList.add('comments','hide');
    const comments = await getPostComments(Id);
    const fragment = createComments(comments);
    section.appendChild(fragment);
    return section;
}


async function createPosts(posts) {
//    console.log(`15. WORKING`);
    if (!posts) return;
    let fragment = document.createDocumentFragment();
    for (let i=0; i < posts.length; i++) {
        post = posts[i];
        let article = document.createElement('article');
        const h2 = createElemWithText('h2',post.title);
        const p = createElemWithText('p',post.body);
        const postp = createElemWithText('p',`Post ID: ${post.id}`);
        const author = await getUser(post.userId);
        const authorp = createElemWithText('p',`Author: ${author.name} with ${author.company.name}`)
        const catchphrase = createElemWithText('p',author.company.catchPhrase);
        let button = createElemWithText('button','Show Comments');
        button.dataset.id = post.id;
        button.setAttribute("data-post-id", post.id);
        article.append(h2,p,postp,authorp,catchphrase,button);
        const section = await displayComments(post.id);
        article.append(section);
        fragment.appendChild(article);
    }
    return fragment;
}

async function displayPosts(posts) {
//    console.log(`16. WORKING`);
    const main = document.querySelector("main");
    const element = (posts) ? await createPosts(posts) : createElemWithText("p","Select an Employee to display their posts.","default-text");
    main.append(element);
    return element;
}

function toggleComments(event, postId) {
    if (!event || !postId) return;
//    console.log(`17. WORKING`);
    event.target.listener = true;
    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);
    return [ section, button ];
}

async function refreshPosts(posts) {
    if (!posts) return;
//    console.log(`18. WORKING`);
    const removeButtons = removeButtonListeners();
    const main = deleteChildElements(document.querySelector("main"));
    const frag = await displayPosts(posts);
    const addButtons = addButtonListeners();
    return [removeButtons, main, frag, addButtons ]
}


async function selectMenuChangeEventHandler(event){
    // console.log(`19. WORKING`)
    const userId = event? event.target.value : 1;
    const jsonData = await getUserPosts(userId);
    const refreshPostsArray = await refreshPosts(jsonData);
    const finalArray = [userId, jsonData, refreshPostsArray]; 
    return finalArray;
}

async function initPage() {
    const users = await getUsers();
    // console.log(`20. WORKING`)
    const select = populateSelectMenu(users);
    return [users, select];
}

async function initApp() {
    initPage();
    // console.log(`21. WORKING`)
    const select = document.getElementById("selectMenu");
    select.addEventListener("change",selectMenuChangeEventHandler);
}

document.addEventListener("DOMContentLoaded",initApp);