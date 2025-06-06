<script>
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import { getNotes, updateNote, addNote, deleteNote as deleteNoteFromStore } from '$lib/note-data.svelte';
    import apiClient from '$lib/apiClient';
    import { ChevronRight, ChevronDown, Plus, Trash, Edit } from 'lucide-svelte';
    import NoteIcon from './noteicon.svelte';
    import { derived } from 'svelte/store';

    // Props
    let { noteId, parentGetChildren } = $props();
    
    let note = $derived(getNotes().filter(n => n._id === noteId)[0]);
    // Reactive state
    let dropdown = $state(false);
    let children = $state([]);
    let showContextMenu = $state(false);
    let contextMenuPosition = $state({ x: 0, y: 0 });
    let menuDimensions = $state({ width: 0, height: 0 });
    let isEditingTitle = $state(false);
    let editedTitle = $state(note.title);
    let titleInputRef;
    
    // Edit mode is managed through a separate variable not connected to Svelte's reactivity
    // to prevent race conditions with click events
    let editModeActive = false;


    
    // Context menu items
    const menuItems = [
        {
            name: 'edit',
            onClick: handleEditFromMenu,
            displayText: "Edit",
            class: 'text-blue-500'
        },
        {
            name: 'delete',
            onClick: deleteNote,
            displayText: "Delete",
            class: 'text-red-500'
        }
    ];

    // Variable to store click event handler references for cleanup
    let documentClickHandler;

    onMount(() => {
        fetchChildren();
        
        // Create a function that will handle clicks outside of the edit input
        documentClickHandler = (e) => {
            // Only check for clicks outside if we're in edit mode
            if (editModeActive && titleInputRef && !titleInputRef.contains(e.target)) {
                finishEditing();
            }
            
            // Handle context menu closing
            if (showContextMenu) {
                const contextMenu = document.getElementById('context-menu');
                if (contextMenu && !contextMenu.contains(e.target)) {
                    showContextMenu = false;
                }
            }
        };
        
        // Add the click handler with a delay to avoid initial execution
        setTimeout(() => {
            document.addEventListener('click', documentClickHandler);
        }, 100);
    });
    
    onDestroy(() => {
        // Clean up event listeners
        if (documentClickHandler) {
            document.removeEventListener('click', documentClickHandler);
        }
    });

    async function fetchChildren() {
        children = getNotes().filter((n) => n.parent === noteId);
    }
    
    async function addChildNote(e) {
        await addNote({
            title: 'New Note',
            parent: noteId
        });
        await fetchChildren();
        dropdown = true;
    }

    async function deleteNote() {
        await deleteNoteFromStore(noteId);
        if (note.parent) {
            parentGetChildren();
        } else {
            goto('/');
        }
    }

    function startEditing(e) {
        if (e) e.stopPropagation();
        
        editModeActive = true;
        
        isEditingTitle = true;
        editedTitle = note ? note.title : '';
        
        setTimeout(() => {
            if (titleInputRef) {
                titleInputRef.focus();
                titleInputRef.select();
            }
        }, 0);
    }
    
    function handleEditFromMenu() {
        showContextMenu = false;
        setTimeout(() => {
            startEditing();
        }, 100);
    }
    
    function finishEditing() {
        editModeActive = false;

        if (editedTitle.trim() === '') {
            editedTitle = note ? note.title : '';
            isEditingTitle = false;
        } else if (editedTitle !== note ? note.title : '') {
            updateNote(noteId, { title: editedTitle }).then(() => {
                isEditingTitle = false;
            });
        } else {
            isEditingTitle = false;
        }
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            finishEditing();
        } else if (event.key === 'Escape') {
            event.preventDefault();
            editedTitle = note ? note.title : '';
            editModeActive = false;
            isEditingTitle = false;
        }
    }
    
    function toggleDropdown(e) {
        e.stopPropagation();
        dropdown = !dropdown;
    }

    function handleRightClick(event) {
        if (isEditingTitle) return;
        
        event.preventDefault();
        event.stopPropagation();
        
        const x = Math.min(
            event.pageX, 
            window.innerWidth + window.scrollX - 150
        );
        const y = Math.min(
            event.pageY,
            window.innerHeight + window.scrollY - 100
        );
        
        contextMenuPosition = { x, y };
        showContextMenu = true;
    }
    
    function preventPropagation(e) {
        e.stopPropagation();
    }


</script>

<div class="relative text-xl">
    <div 
        class="group cursor-pointer flex w-full bg-zinc-900 rounded-md border-[1px] border-zinc-700 justify-between items-center h-8 px-2 hover:border-zinc-500 transition-colors"
        
        oncontextmenu={handleRightClick}
    >
        <div class="flex items-center">
            {#if children.length > 0}
                <button 
                    class="mr-1 flex items-center justify-center w-5 h-5 text-zinc-400 hover:text-white transition-colors"
                    onclick={toggleDropdown}
                >
                    {#if dropdown}
                        <ChevronDown size={16} />
                    {:else}
                        <ChevronRight size={16} />
                    {/if}
                </button>
            {:else}
                <div class="w-5"></div>
            {/if}
            
            
        </div>
        {#if isEditingTitle}
                <div class="flex-grow" onclick={preventPropagation}>
                    <input 
                        type="text" 
                        bind:value={editedTitle}
                        bind:this={titleInputRef}
                        class="bg-zinc-800 text-white px-1 rounded outline-none field-sizing-content focus:ring-1 focus:ring-blue-500"
                        onkeydown={handleKeyDown}
                    />
                </div>
            {:else}
                <button 
                    onclick={() => {goto(`/note/${noteId}`);preventPropagation(event);}}
                    class="flex-grow flex items-center justify-start"
                    >
                <span 
                    class="truncate max-w-30"
                    ondblclick={startEditing}
                >{note ? note.title : 'Loading...'}</span>
                </button>
            {/if}
        <button 
            class="invisible group-hover:visible flex items-center justify-center w-5 h-5 text-zinc-400 hover:text-white transition-colors"
            onclick={addChildNote}
            title="Add child note"
        >
            <Plus size={16} />
        </button>
    </div>
    
    {#if dropdown && children.length > 0}
        <div class="flex flex-col w-full pl-4 gap-1 mt-1 border-l border-zinc-800">
            {#each children as child (child._id)}
                <NoteIcon noteId={child._id} parentGetChildren={fetchChildren} />
            {/each}
        </div>
    {/if}
</div>

{#if showContextMenu}
    <div 
        id="context-menu"
        class="fixed bg-zinc-900 border border-zinc-700 rounded-md shadow-lg py-1 z-50 min-w-32"
        style="top: {contextMenuPosition.y}px; left: {contextMenuPosition.x}px;"
    >
        {#each menuItems as item}
            <button 
                class="w-full text-left px-4 py-2 hover:bg-zinc-800 flex items-center gap-2 transition-colors"
                onclick={item.onClick}
            >
                <svelte:component this={item.icon} size={16} class={item.class} />
                <span class={item.class}>{item.displayText}</span>
            </button>
        {/each}
    </div>
{/if}