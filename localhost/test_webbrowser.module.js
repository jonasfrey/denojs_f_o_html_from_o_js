import {
    f_display_test_selection_or_run_selected_test_and_print_summary,
    f_o_test
} from "https://deno.land/x/deno_test_server_and_client_side@1.1/mod.js"

//readme.md:start
//md: ![./logo_wide.png](./logo_wide.png)
//readme.md:end

//./readme.md:start
//md: # changelog
//md: 
//./readme.md:end

import {
    f_o_html__and_make_renderable,
    f_o_js__overlay_window,
    f_o_js__notifire, 
    f_throw_notification,
    f_o_js_from_params
}
from './client.module.js'

import {
    O_vec2
} from "https://deno.land/x/vector@0.8/mod.js"

let a_o_test = [
    f_o_test(
        'basic_example_convert_js_to_html', 
        async ()=>{
            //./readme.md:start
            //md: ## most simple example 
            //md: we can convert a js object to html
            //md: all the properties are going to be set with the exact same name as on the html object
            //md: all but the tagName, it needs to be named 's_tag' on the js object 
            //md: children elements are also possible , for this purpose an array is required
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
            //./readme.md:end
        }
    ),
    f_o_test(
        'use_map_functions', 
        async ()=>{
            //./readme.md:start
            //md: ## we now can add child objects and render arrays like this'
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
            //./readme.md:end
        }
    ),
    f_o_test(
        'updateing_and_re_rendering', 
        async ()=>{
            //./readme.md:start
            //md: ## updating and re-rendering of objects/'components' 
            //md: we need to add the `f_o_jsh` function which returns a javascript object
            //md: it will get called on every ._f_update() and ._f_render() or call
            var a_s_animal = ['luchs', 'pferd', 'schildkroete']
            let s_color_background = 'red';
            var o_js__a_s_animal = {
                f_o_jsh: function(){
                return {
                    style: `background-color: ${s_color_background}`,
                    a_o: [
                    ...a_s_animal.map(function(
                        s,
                        n_idx 
                    ){
                        return {
                            s_tag:'option',
                            innerText: `animal number ${n_idx} is called: '${s}'`
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
                    o_js__a_s_animal// we can add the object / 'component' here
                ]
                }
            );
            document.body.appendChild(o_html)
            // if we cann ._f_update() it will only do an update of the html element, each attribute is going to be updated
            // this is usefull if we want to change a style or a class for example
            document.onclick = function(){
                s_color_background = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`
                o_js__a_s_animal._f_update();
            }

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
            //./readme.md:end
        }
    ),
    f_o_test(
        'application', 
        async ()=>{
            //./readme.md:start
            //md: ## complex object 
            //md: by using the basic functioniality of javascript we can create a full featured gui application!
            //md: now let the fun begin 
            
            // we can define a 'state'
            let o_state = {
                s_text: 'this is my input', 
                a_s_text: [], 
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

                        }
                    ]
                }
            );
            document.body.appendChild(o_html)
            //thats it, our application will run!
            //./readme.md:end
        }
    ),
    f_o_test(
        'modules', 
        async ()=>{
            //./readme.md:start
            //md: ## modules
            //md: well... what should i say, a module is nothing more than an object :shrug:
            
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
            //./readme.md:end
        }
    ),
    f_o_test(
        "overlay_window", 
        async ()=>{
            let o_state = {
                s: "this is an example state string in a scope", 
                o_dedicated_to_overlay: {}
            };
            let o = await f_o_html__and_make_renderable(
                {
                    a_o: [
                        f_o_js__overlay_window( // this will add the variables to the state
                            [
                              {
                                innerText: 'drag ME!'
                              }, 
                            ], 
                            o_state.o_dedicated_to_overlay
                        ), 
                    ]
                }
            )
            // the 
            window.setInterval(()=>{
                o_state.o_dedicated_to_overlay.o_trn.n_x = (Math.random())*window.innerWidth
                o_state.o_dedicated_to_overlay.o_trn.n_y = (Math.random())*window.innerHeight
                console.log(o_state.o_dedicated_to_overlay.o_js__overlay_window._f_update());
            }, 1000)
            // console.log(o)
            window.setTimeout(()=>{o_state.o_dedicated_to_overlay.o_scl = new O_vec2(500,500)}, 1000)
            document.body.appendChild(o)

        }
    ), 

    f_o_test(
        "notifire", 
        async ()=>{
            let o_state = {
                s: "this is an example state string in a scope", 
                o_dedicated_to_mod: {}
            };
            let o = await f_o_html__and_make_renderable(
                {
                    a_o: [
                        f_o_js__notifire( // this will add the variables to the state
                            [], 
                            o_state.o_dedicated_to_mod
                        ), 
                    ]
                }
            )
            document.body.appendChild(o);
            console.log(o_state.o_dedicated_to_mod)
            // o_state.o_dedicated_to_mod.a_s_notification.push('xxx');
            // o_state.o_dedicated_to_mod.o_js__notifire._f_render();

            // o_state.o_dedicated_to_mod.a_s_notification.push('2');
            // o_state.o_dedicated_to_mod.o_js__notifire._f_render();

            // o_state.o_dedicated_to_mod.a_s_notification.push('3');
            // o_state.o_dedicated_to_mod.o_js__notifire._f_render();
            f_throw_notification('lol')
            f_throw_notification('2')
            f_throw_notification('3')
            f_throw_notification('3')
            f_throw_notification('3')
            f_throw_notification('3')
            f_throw_notification('3')
            await o_state.o_dedicated_to_mod.o_js__a_s_not._f_render()
            window.setTimeout(()=>{
                f_throw_notification('!@#4')
            },100)
            window.onmousedown = ()=>{
                // o_state.o_dedicated_to_mod.a_s_not.push('asdf !')
                o_state.o_dedicated_to_mod.o_js__a_s_not._f_render()
            }
        }
    ), 


    f_o_test(
        "custom_notifire", 
        async ()=>{
            let o_state = {
                s: "this is an example state string in a scope", 
                a_s_not: ['hello'],
            };
            let o = await f_o_html__and_make_renderable(
                {
                    a_o: [
                        Object.assign(
                            o_state, 
                            {
                                o_js__a_s_not: {
                                    f_o_jsh: ()=>{
                                        return {
                                            a_o: [
                                                o_state.a_s_not.map(s=>{
                                                    return {
                                                        innerText: s
                                                    }
                                                })
                                            ]
                                        }
                                    }
                                }
                            }
                        ).o_js__a_s_not
                    ]
                }
            )

            document.body.appendChild(o);
            o_state.a_s_not.push('asdf !')
            o_state.o_js__a_s_not._f_render()
            console.log(o_state.o_js__a_s_not)
            o_state.a_s_not.push('asdf !')
            o_state.o_js__a_s_not._f_render()
            console.log(o_state.o_js__a_s_not)
        }
    ), 

    f_o_test(
        "custom_notifire_2", 
        async ()=>{
            let o_state = {
                s: "this is an example state string in a scope", 
                a_s_not: ['hello'],
            };
            let o = await f_o_html__and_make_renderable(
                {
                    a_o: [
                        f_o_js_from_params(
                            o_state, 
                            'o_js__a_s_not', 
                            {
                                f_o_jsh: ()=>{
                                    return {
                                        a_o: [
                                            o_state.a_s_not.map(s=>{
                                                return {
                                                    innerText: s
                                                }
                                            })
                                        ]
                                    }
                                }
                            }
                        )
                    ]
                }
            )

            document.body.appendChild(o);
            o_state.a_s_not.push('asdf !')
            o_state.o_js__a_s_not._f_render()
            console.log(o_state.o_js__a_s_not)
            o_state.a_s_not.push('asdf !')
            o_state.o_js__a_s_not._f_render()
            console.log(o_state.o_js__a_s_not)
        }
    ), 
    f_o_test(
        "custom_notifire_3", 
        async ()=>{
            let o_state = {
                s: "this is an example state string in a scope", 
                a_s_not: ['hello'],
            };
            let o_js__a_s_not = {
                f_o_jsh: ()=>{
                    return {
                        a_o: [
                            o_state.a_s_not.map(s=>{
                                return {
                                    innerText: s
                                }
                            })
                        ]
                    }
                }
            }
            let o = await f_o_html__and_make_renderable(
                {
                    a_o: [
                        o_js__a_s_not
                    ]
                }
            )

            document.body.appendChild(o);
            o_state.a_s_not.push('asdf !')
            o_js__a_s_not._f_render()
            console.log(o_js__a_s_not)
            o_state.a_s_not.push('asdf !')
            o_js__a_s_not._f_render()
            console.log(o_js__a_s_not)
        }
    ), 

]


f_display_test_selection_or_run_selected_test_and_print_summary(
    a_o_test
)
// //readme.md:end