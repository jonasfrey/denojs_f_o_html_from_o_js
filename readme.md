<!-- {"s_msg":"this file was automatically generated","s_by":"f_generate_markdown.module.js","s_ts_created":"Thu Sep 19 2024 22:42:57 GMT+0200 (Central European Summer Time)","n_ts_created":1726778577916} -->
# changelog

## most simple example
we can convert a js object to html
all the properties are going to be set with the exact same name as on the html object
all but the tagName, it needs to be named 's_tag' on the js object
children elements are also possible , for this purpose an array is required
```javascript
            document.body.appendChild(
                await f_o_html__and_make_renderable(
                    {
                        s_tag: 'div', 
                        a_o: [
                            {
                                s_tag: 'button', // note: 's_tag' property name
                                innerHTML: `i am a rendered button: ${window.performance.now()}`,
                                onclick: function(){
                                    alert("hey, you clicked me!")
                                }
                            }, 
                            {
                                //if no 's_tag' is set, the element will be a 'div' element
                                innerText: "i am a DIV!"
                            }
                        ]
                    }
                )
            );
```
## we now can add child objects and render arrays like this'
```javascript
            document.body.appendChild(
                await f_o_html__and_make_renderable(
                {
                    s_tag: 'div', 
                    a_o:[
                    {
                        s_tag: "button", 
                        innerText: "i am a button"
                    }, 
                    ...[1,2,3,4].map(function(n){ //with the help of js array.map function we can dynamically render elements :)
                        return {
                        s_tag: "button", 
                        innerText: `i am button number: ${n}`
                        }
                    })
                    ]
                }
                )
            );
```
## updating and re-rendering of objects/'components'
we need to add the `f_o_jsh` function which returns a javascript object
it will get called on every ._f_update() and ._f_render() or call
```javascript
            var a_s_animal = ['luchs', 'pferd', 'schildkroete']
            let s_color_background = 'red';
            let n_count = 0;
            var o_js__a_s_animal = {
                f_o_jsh: function(){
                    console.log('f_o_jsh was called')
                    return {
                        style: `background-color: ${s_color_background}`,
                        a_o: [
                        ...a_s_animal.map(function(
                            s,
                            n_idx 
                        ){
                            return {
                                s_tag:'option',
                                innerText: `animal number ${n_idx} is called: '${s}'`, 
                                b_render: parseInt(n_idx)%2==(n_count%2)
                            }
                        })
                        ]
                    }
                }
            }
            var o_html = await f_o_html__and_make_renderable(
                {
                a_o: [
                    {
                    s_tag: "h2", 
                    innerText: "This is my app"
                    }, 
                    o_js__a_s_animal,// we can add the object / 'component' here, 
                    {
                        s_tag: 'button',
                        innerText: "click me to update",  
                        onclick: async ()=>{
                            // if we cann ._f_update() it will only do an update of the html element, each attribute is going to be updated
                            // this is usefull if we want to change a style or a class for example
                            s_color_background = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`
                            o_js__a_s_animal._f_update();
                        }
                    },
                    {
                        s_tag: 'button',
                        innerText: "click me to re-render completly",  
                        onclick: async ()=>{
                            n_count +=1;
                            o_js__a_s_animal._f_render();
                        }
                    }
                ]
                }
            );
            document.body.appendChild(o_html)

            // if we want to update the dom of all the children tough, we have to use '_f_render()'
            // so we can manually render the single object / 'component' like this
            // so we can write/read the array and then render it
            a_s_animal.push('rabbit')
            await o_js__a_s_animal._f_render();
            // we can also render only after multiple manipulations
            a_s_animal.push('deer')
            a_s_animal.push('whale')
            a_s_animal.push('bird')
            await o_js__a_s_animal._f_render();
```
## conditional rendering
```javascript
            let o_state = {
                s_text: 'asdf'
            }
            var o_html = await f_o_html__and_make_renderable(
                {
                a_o: [
                    {
                        s_tag: "h2", 
                        innerText: "This is my app"
                    }, 
                    Object.assign(
                        o_state,
                        {
                            o_js__s_text: {
                                f_o_jsh: ()=>{
                                    let b_render = parseInt(window.performance.now())%2==0
                                    console.log(
                                        b_render
                                    )
                                    return {
                                        b_render: b_render, 
                                        innerText: o_state.s_text
                                    }
                                }
                            }
                        }
                    ).o_js__s_text,
                    {
                        s_tag: 'button',
                        innerText: "click me to update",  
                        onclick: async ()=>{
                            // if we cann ._f_update() it will only do an update of the html element, each attribute is going to be updated
                            // this is usefull if we want to change a style or a class for example
                            o_state.o_js__s_text._f_render();
                        }
                    },

                ]
                }
            );
            document.body.appendChild(o_html)
```
## complex object
by using the basic functioniality of javascript we can create a full featured gui application!
now let the fun begin
```javascript
            // we can define a 'state'
            let o_state = {
                s_text: 'this is my input', 
                a_s_text: [], 
                n_count: 0
            }
            // we can also have modules as single objects
            let o_js__random_number = {
                s_id: 'random_number',
                f_o_jsh: function(){
                    console.log('random num rendered!')
                    return {
                        innerText: `rand num: ${Math.random()}`
                    }
                }
            }
            let o_js__random_text = {
                s_id: 'random_text',
                f_o_jsh: function(){
                    console.log('random text rendered!')
                    return {
                        innerText: `rand text: ${new Array(10).fill(0).map(n=>{return String.fromCharCode(65+Math.random()*32)})}`
                    }
                }
            }
            let o_js__active = o_js__random_number;
            window.onmousedown = function(o_e){
                o_js__active = [
                    o_js__random_number, 
                    o_js__random_text
                ].filter(o=>o!=o_js__active)[0]
                o_state?.o_js__active_container?._f_render?.();
            }

            var o_html = await f_o_html__and_make_renderable(
                {
                    a_o: [
                        Object.assign(// we assign the js object to the state so that we can reference and update/render it later on
                            o_state, 
                            {
                                o_js__text: {
                                    f_o_jsh: ()=>{
                                        return {
                                            innerText: o_state.s_text, 
                                        }
                                    }
                                }
                            }
                        ).o_js__text, // we have to return the object containing the 'f_o_jsh' function
                        Object.assign(  
                            o_state, 
                            {
                                o_js__a_s_text: {
                                    f_o_jsh: ()=>{
                                        return {
                                            a_o: o_state.a_s_text.map(s=>{
                                                return {
                                                    innerText: s
                                                }
                                            })
                                        }
                                    }
                                }
                            }
                        ).o_js__a_s_text, 
                        Object.assign(
                            o_state, 
                            {
                                o_js__input: {
                                    f_o_jsh: ()=>{
                                        return {
                                            s_tag: "input", 
                                            value: o_state.s_text, 
                                            oninput: function(o_e){
                                                o_state.s_text = o_e.target.value;
                                                // we can now reference each js object where the s_text value is used, and update or render it
                                                // rendering is needed if the object is nested
                                                o_state?.o_js__text?._f_update();
                                            }
                                        }
                                    }
                                }
                            }
                        ).o_js__input,
                        {
                            s_tag: 'button',
                            innerText: "add text",
                            onclick: ()=>{
                                o_state.a_s_text.push(o_state.s_text);
                                o_state.o_js__a_s_text?._f_render();
                            } 

                        }, 
                        Object.assign(
                            o_state, 
                            {
                                o_js__active_container: {
                                    f_o_jsh: ()=>{
                                        o_state.n_count +=1;                                        
                                        return {
                                            a_o: [
                                                {
                                                    innerText: "below the 'active' is rendered",
                                                    b_render: o_state.n_count % 2 == 0
                                                },
                                                // {
                                                //     f_o_jsh: o_js__active?.f_o_jsh
                                                // }
                                                o_js__active,
                                            ]
                                            
                                        }
                                    }
                                }
                            }
                        ).o_js__active_container,
                    ]
                }
            );
            document.body.appendChild(o_html)
            //thats it, our application will run!
```
## modules
well... what should i say, a module is nothing more than an object :shrug:
```javascript
            let f_o_js__module_select = function(
                o_state, 
                a_s_option, 
                s_option,
                f_on_click_option
            ){
                Object.assign(
                    o_state, 
                    {
                        a_s_option: a_s_option, 
                        s_option,
                        o_js: null, 
                    }
                )
                o_state.o_js = {
                    f_o_jsh: function(){
                        return {
                            class: "module_select",
                            a_o:[

                                ...o_state.a_s_option.map(
                                    s=>{
                                        return {
                                            class: "option", 
                                            innerText: `${(o_state.s_option == s) ? 'active-': ''} option: ${s}`, 
                                            onclick: async function(){
                                                o_state.s_option = s;
                                                f_on_click_option(arguments)
                                                await o_state?.o_js?._f_render();
                                            }
                                        }
                                    }
                                )
                            ]
                        }
                    }
                }

                return o_state.o_js; 
            }
            // we can define a 'state'
            let o_state = {
                o_state__mod_color: {
                    a_s_option: ['red', 'green', 'blue'], 
                    s_option: ''
                }, 
                o_state__mod_animal: {
                    a_s_option: ['elephant', 'tiger', 'chimpansee'],
                    s_option: ''
                }, 
            }

            var o_html = await f_o_html__and_make_renderable(
                {
                    a_o: [
                        Object.assign(
                            o_state, 
                            {
                                o_js__text_color: {
                                    f_o_jsh: ()=>{
                                        return {
                                            innerText: `'${o_state.o_state__mod_color.s_option}': is currently your favorite, choose another one by clicking below`, 
                                        }
                                    }
                                }
                            }
                        ).o_js__text_color,
                        f_o_js__module_select(
                            o_state.o_state__mod_color,
                            o_state.o_state__mod_color.a_s_option, 
                            o_state.o_state__mod_color.s_option,
                            ()=>{
                                console.log('option was clicked!')
                                o_state.o_js__text_color._f_update();
                            }
                        ), 
                        Object.assign(
                            o_state, 
                            {
                                o_js__text_animal: {
                                    f_o_jsh: ()=>{
                                        return {
                                            innerText: `'${o_state.o_state__mod_animal.s_option}': is currently your favorite, choose another one by clicking below`, 
                                        }
                                    }
                                }
                            }
                        ).o_js__text_animal,
                        f_o_js__module_select(
                            o_state.o_state__mod_animal,
                            o_state.o_state__mod_animal.a_s_option, 
                            o_state.o_state__mod_animal.s_option,
                            ()=>{
                                console.log('option was clicked!')
                                o_state.o_js__text_animal._f_update();
                            }
                        )
                    ]
                }
            );
            document.body.appendChild(o_html)
            //thats it, our application will run!
```
## error test
```javascript
            let o_state = {}
            window.o_state = o_state
            document.body.appendChild(
                await f_o_html__and_make_renderable(
                {
                    s_tag: 'div', 
                    a_o:[
                        Object.assign(
                            o_state, 
                            {
                                o_js__test: {
                                    f_o_jsh:()=>{
                                        let b_error = Math.random() > 0.5;
                                        if(b_error){
                                            asdf
                                        }
                                        return {
                                            innerText: `i will randomly throw an error: ${Math.random()} `
                                        }
                                    }
                                }
                            }
                        ).o_js__test,
                    {
                        s_tag: "button", 
                        innerText: "i am a button", 
                        onpointerdown : async ()=>{await o_state?.o_js__test._f_render()}
                    }, 
                    ...[1,2,3,4].map(function(n){ //with the help of js array.map function we can dynamically render elements :)
                        return {
                        s_tag: "button", 
                        innerText: `i am button number: ${n}`
                        }
                    })
                    ]
                }
                )
            );
```
## f_after_f_o_html__and_make_renderable
```javascript
            // if there is a canvas we would have to always create a new element and re-render
            // instead we can re-append it after a certain o_jsh has been rendered and appended to its parent in the tree
            let o_canvas = document.createElement("canvas");
            let o_ctx = o_canvas.getContext("2d");
            o_ctx.beginPath();
            o_ctx?.arc(50,50,20, 0, (6.2831/4)*3);
            o_ctx.stroke();
            let o_state = {}
            let o = await f_o_html__and_make_renderable(
                {
                    a_o: [
                        {
                            innerText: "asdf",
                        },
                        Object.assign(
                            o_state, 
                            {
                                o_js__canvas: {
                                    f_after_f_o_html__and_make_renderable: (v_o_html)=>{
                                        console.log({v_o_html})
                                        v_o_html.appendChild(o_canvas);
                                        console.log('render done, canvas appended')
                                    },
                                    f_o_jsh: ()=>{
                                        return {
                                            id: "canvas_parent"
                                        }
                                    }
                                }
                            }
                        ).o_js__canvas
                    ]
                }
            );
            setTimeout(async()=>{
                await o_state.o_js__canvas._f_render();
                console.log('re render done')
            },1000)

            document.body.appendChild(o)
```
## f_after_f_o_html__and_make_renderable
```javascript
            // if there is a scrollable element that will be rerendered the scroll state will be lost on rerender, therefore we can 
            // do this
            let o_state = {
                a_n : new Array(100).fill(0).map((n, n_idx)=>{return n_idx})
            };
            let n_x_tmp = 0;
            let o = await f_o_html__and_make_renderable(
                {
                    style: "max-height: 30vh; overflow-y:scroll",
                    a_o: [
                        {
                            innerText: "asdf",
                        },
                        Object.assign(
                            o_state, 
                            {
                                o_js__a_n: {
                                    f_o_jsh: ()=>{
                                        return {
                                            f_before_f_o_html__and_make_renderable: (v_o_html)=>{
                                                n_x_tmp = window.pageYOffset;
                                                console.log({v_o_html, n_x_tmp})
                                                console.log(
                                                    {b_active: document.activeElement == v_o_html   }
                                                )
                                            },
                                            a_o: [
                                                ...o_state.a_n.map(n=>{
                                                    return {
                                                        s_tag: "input",
                                                        style: "width: 100%", 
                                                        value: `${n}: rand:${Math.random()}`
                                                    } 
                                                })
                                            ]
                                        }
                                    }
                                }
                            }
                        ).o_js__a_n
                    ]
                }
            );
            setInterval(async()=>{
                o_state.a_n = new Array(parseInt(Math.random()*200)).fill(0).map((n, n_idx)=>{return n_idx})

                await o_state.o_js__a_n._f_render();
                console.log('re render done')
            },1000)

            document.body.appendChild(o)
```