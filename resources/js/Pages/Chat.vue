<template>
    <app-layout>
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                Chat
            </h2>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg flex" style="min-height: 400px; max-height:400px;">
                    <!-- list users -->
                    <div class="w-3/12 bg-gray-200 bg-opacity-25 border-r border-gray-200 overflow-y-scroll">
                        <ul>
                            <li :class="(userActive && userActive.id == user.id) ? 'bg-gray-200 bg-opacity-50' : ''"
                                v-for="user in users" :key="user.id"
                                @click="() => {loadMessages(user.id)}"
                                class="p-6 text-lg text-gray-600 leading-7 font-semibold border-b border-gray-200 hover:bg-opacity-50 hover:cursor-pointer hover:bg-gray-200">
                                <p class="flex items-center">
                                    {{ user.name }}
                                    <span class="ml-2 w-2 h-2 bg-blue-300 rounded-full"></span>
                                </p>
                            </li>
                        </ul>
                    </div>
                    <div class="w-9/12 flex flex-col justify-between">
                    <!-- messages -->
                        <div class="w-full p-6 flex flex-col overflow-y-scroll h-full">
                            <div v-for="message in messages" :key="message.id"
                                :class="(message.from == user.id) ? 'text-right' : ''"
                                class="w-full mb-3 message">
                                <p
                                    :class="(message.from == user.id) ? 'messageFromMe' : 'messageToMe'"
                                    class="inline-block p-2 rounded-md " style="max-width: 75%;" >
                                    {{ message.content }}
                                    <span class="block mt-1 text-xs text-gray-500">{{ formatDate(message.created_at) }}</span>
                                </p>
                            </div>

                        </div>
                        <!-- form -->
                        <div v-if="userActive"
                             class="w-full bg-gray-200 bg-opacity-25 p-6 border-t border-gray-200">
                            <form v-on:submit.prevent="sendMessage">
                                <div class="flex rounded-md overflow-hidden border border-gray-300">
                                    <input v-model="message" type="text" class="flex-1 px-4 py-2 text-sm focus:outline-none border-gray-300">
                                    <button type="submit" class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2">Enviar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </app-layout>
</template>

<script>
    import AppLayout from '@/Layouts/AppLayout'
    import moment from 'moment';

    moment.locale("pt-br");

    export default {
        components: {
            AppLayout,
        },
        data() {
            return {
                users: [],
                messages: [],
                userActive: null,
                message: '',
            }
        },
        methods: {
            scrollToBottom: function () {
                if(this.messages.length)
                {
                    document.querySelectorAll('.message:last-child')[0].scrollIntoView();
                }
            },
            sendMessage: async function () {

               await axios.post('api/messages/store', {
                    'content': this.message,
                    'to': this.userActive.id
                }).then(response => {
                    this.messages.push({
                        'from': this.user.id,
                        'to': this.userActive.id,
                        'content': this.message,
                        'created_at': new Date().toISOString(),
                        'updated_at': new Date().toISOString()
                    });
                    this.message = '';
                });
                this.scrollToBottom();
            },
            loadMessages: async function(userId) {

                axios.get(`api/users/${userId}`).then(response => {
                    this.userActive = response.data.user
                });

                await axios.get(`api/messages/${userId}`).then(response => {
                    this.messages = response.data.messages
                });

                this.scrollToBottom();
            },
            formatDate: function(value){
                if(value) {
                    return moment(value).format('DD/MM/YYYY HH:mm')
                }
            },
        },
        computed: {
            user() {
                return this.$page.props.auth.user
            }
        },
        mounted() {

            axios.get('api/users').then(response => {
                this.users = response.data.users
            });
        }
    }
</script>
