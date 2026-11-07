fx_version 'cerulean'
game 'gta5'

name 'era_pvp_loading'
author '64r3al'
description 'Cinematic, configurable ERA PVP FiveM loading screen.'
version '0.1.0'

loadscreen 'html/index.html'
loadscreen_cursor 'yes'

files {
    'html/index.html',
    'html/css/*.css',
    'html/js/*.js',
    'html/assets/images/*',
    'html/assets/audio/*'
}

server_script 'server.lua'
