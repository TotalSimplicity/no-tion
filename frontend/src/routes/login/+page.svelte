<script lang="ts">
    import apiClient from '$lib/apiClient';
    import { login } from '$lib/auth';
    let username = $state('')
    let password = $state('')


    async function loginn(){
        login(username, password)
    }
</script>

<div class="flex flex-row h-full items-center justify-center">
    <form class="bg-gray-900 w-96 h-96 rounded-md shadow-lg flex flex-col items-center justify-center" onsubmit={loginn}>
        <div class="flex flex-col items-center justify-center">
            <h1 class="text-3xl text-white">Login</h1>
            <input bind:value={username} type="text" placeholder="Username" class="bg-gray-800 text-white p-2 m-2 rounded-md" />
            <input bind:value={password} type="password" placeholder="Password" class="bg-gray-800 text-white p-2 m-2 rounded-md" />
            <button class="bg-blue-500 text-white p-2 m-2 rounded-md">Login</button>
        </div>
    </form>
</div>