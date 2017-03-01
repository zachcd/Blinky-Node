'use strict'
const blessed = require('blessed');
const blink1 = require('node-blink1');
const options = require('./menu.json');
const color = require('./colors.json');
const config = require('./config.json');

// Create a screen object.
var screen = blessed.screen({
    smartCSR: true
});

let kill = true;
screen.title = 'Blink Control';


const menuList = blessed.list({
    label: 'Choose a Color Option',
    tags: true,
    draggable: false,
    top: "5%",
    left: "center",
    height: '70%',
    width: "90%",
    keys: true,
    border: 'line',
})

const loadBar = blessed.ProgressBar({
    orientation:'horizontal',
    filled: 0,
    label:"System Startup",
    top:"center",
    right:"center",
    left:"center",
    width:"75%",
    height:'20%',
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        bg: 'blue',
        border: {
            fg: '#f0f0f0'
        }
    }
});

const spinner = blessed.loading({
    label: "Startup Complete",
    left:"center",
    right:"center",
    top:"center",
    width:"100%",
    hieght:"100%"
})


const currentBox = blessed.box({
    label: "Current Mode",
    top:"76%",
    left:"center",
    content:"clean bootup",
    width:"90%",
    height: "25%",
    border:'line'
});


menuList.setItems(config.map((value, index, array)=>{
     return Number(index+1).toString() + " | " + value['menu'];
}))




// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function (ch, key) {
  light.fadeToRGB(500, 0, 0, 0, ()=>{
    process.exit(0);
  })
});

screen.key(config.map((value, index, array)=>{ return String(index +1)}), function (ch, key) {
    let mode = config[Number(ch) - 1];
    
    currentBox.setContent("Current Mode is " + mode.menu);
    kill = true
    switch(mode.squence.type){
        case 'solid':
            light.fadeToRGB(mode.squence.time * 60 * 1000, mode.colors[0].r, mode.colors[0].g, mode.colors[0].b)
            break;
        case 'breath':
            kill = false;
            breather(mode.squence.time, mode.colors, 0, 0);
            break;
    }
    screen.render();
    
    return true;
});


//Mount the loadBar
screen.append(loadBar);


if(blink1.devices() !== 0){
    loadBar.progress(40);
    screen.render();
}

const light = new blink1();
light.setRGB(0,0,0);

light.fadeToRGB(0.01 * 60 * 1000, color.green.r, color.green.g, color.green.b, 1, (data)=>{
    loadBar.progress(30);
    screen.render();

    light.fadeToRGB(0.01 * 60 * 1000, color.green.r, color.green.g, color.green.b, 2, (data)=>{
        loadBar.progress(30);
        screen.render();
        loadup();
    })
})


function loadup(){
    setTimeout(()=>{
        loadBar.progress(100);
        screen.render();
        setTimeout(()=>{
            screen.remove(loadBar);
            // screen.append(spinner);
            screen.render();
            setTimeout(()=>{
                screen.append(menuList);
                screen.render();
                setTimeout(()=>{
                    screen.append(currentBox);
                    screen.render();
                    menuList.focus();
                }, 0.01 * 60 * 1000)
            }, 0.01 * 60 * 1000)
        }, 0.01 * 60 * 1000)
    }, 0.01 * 60 * 1000)
}

function breath(led){
    light.fadeToRGB(1000, color.blue.r, color.blue.g, color.blue.b, led,()=>{
        if(kill) return
        light.fadeToRGB(500, 0, 0, 0, led, ()=>{
            if(kill) return
            if(led == 1){
                breath(2);
            } else {
                breath(1);
            }
        })
    })
}

function breather(time, colors, current, led){
    
    light.fadeToRGB(time,colors[current].r,colors[current].g,colors[current].b, led,()=>{
        if(kill) return
        light.fadeToRGB(time * 2, 0, 0, 0, led, ()=>{
            if(kill) return
            current++
            if(current == colors.length) current = 0;
            if(led == 1){
                led++;
            } else {
                led = 1
            }
            breather(time, colors, current, led);
        })
    })
}


function rage(led){
    light.fadeToRGB(500, color.red.r, color.red.g, color.red.b, led,()=>{
        if(kill) return
        light.fadeToRGB(250, 0, 0, 0, led, ()=>{
            if(kill) return
            if(led == 1){
                rage(2);
            } else {
                rage(1);
            }
        })
    })
}

// Render the screen.
screen.render();
