<script>
    // pos is cursor position when right click occur
    let pos = { x: 0, y: 0 }
    // menu is dimension (height and width) of context menu
    let menu = { h: 0, y: 0 }
    // browser/window dimension (height and width)
    let browser = { h: 0, y: 0 }
    // showMenu is state of context-menu visibility
    let showMenu = false;
    // to display some text
    let content;

    function rightClickContextMenu(e){
        showMenu = true
        browser = {
            w: window.innerWidth,
            h: window.innerHeight
        };
        pos = {
            x: e.clientX,
            y: e.clientY
        };
        // If bottom part of context menu will be displayed
        // after right-click, then change the position of the
        // context menu. This position is controlled by `top` and `left`
        // at inline style. 
        // Instead of context menu is displayed from top left of cursor position
        // when right-click occur, it will be displayed from bottom left.
        if (browser.h -  pos.y < menu.h)
            pos.y = pos.y - menu.h
        if (browser.w -  pos.x < menu.w)
            pos.x = pos.x - menu.w
    }
    function onPageClick(e){
        // To make context menu disappear when
        // mouse is clicked outside context menu
        showMenu = false;
    }
    function getContextMenuDimension(node){
        // This function will get context menu dimension
        // when navigation is shown => showMenu = true
        let height = node.offsetHeight
        let width = node.offsetWidth
        menu = {
            h: height,
            w: width
        }
    }
    function addItem(){
        content.textContent = "Add and item..."
    }
    function print(){
        content.textContent = "Printed..."
    }
    function zoom(){
        content.textContent = "Zooom..."
    }
    function remove(){
        content.textContent = "Removed..."
    }
    function setting(){
        content.textContent = "Settings..."
    }
    let menuItems = [
        {
            'name': 'addItem',
            'onClick': addItem,
            'displayText': "Add Item",
            'class': 'fa-solid fa-plus'
        },
        {
            'name': 'emptyicons',
            'onClick': addItem,
            'displayText': "Empty Icon",
            'class': 'fa-solid fa-square'
        },
        {
            'name': 'zoom',
            'onClick': zoom,
            'displayText': "Zoom",
            'class': 'fa-solid fa-magnifying-glass'
        },
        {
            'name': 'printMenu',
            'onClick': print,
            'displayText': "Print",
            'class': 'fa-solid fa-print'
        },
        {
            'name': 'hr',
        },
        {
            'name': 'settings',
            'onClick': setting,
            'displayText': "Settings",
            'class': 'fa-solid fa-gear'
        },
        {
            'name': 'hr',
        },
        {
            'name': 'trash',
            'onClick': remove,
            'displayText': "Trash",
            'class': 'fa-solid fa-trash-can'
        },
    ]

</script>


{#if showMenu}
<nav use:getContextMenuDimension style="position: absolute; top:{pos.y}px; left:{pos.x}px">
    <div class="navbar" id="navbar">
        <ul>
            {#each menuItems as item}
                {#if item.name == "hr"}
                    <hr>
                {:else}
                    <li><button on:click={item.onClick}><i class={item.class}></i>{item.displayText}</button></li>
                {/if}
            {/each}
        </ul>
    </div>
</nav>
{/if}

<svelte:window on:contextmenu|preventDefault={rightClickContextMenu} 
