import {
    f_display_test_selection_or_run_selected_test_and_print_summary,
    f_o_test
} from "https://deno.land/x/deno_test_server_and_client_side@1.1/mod.js"

import {
    O_vec2
} from "https://deno.land/x/vector@0.8/mod.js"
import {
    f_add_css,
    f_s_css_prefixed,
} from "https://deno.land/x/f_add_css@1.1/mod.js"
//readme.md:start
//md: ![./logo_wide.png](./logo_wide.png)
//readme.md:end

//./readme.md:start
//md: # changelog
//md: 
//./readme.md:end


import {
    f_o_html__and_make_renderable,
    f_o_js_from_params
}
from './client.module.js'
import { f_clear_o_notification } from "./jsh_modules/notifire/mod.js"


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
            //./readme.md:end
        }
    ),
    f_o_test(
        'conditional_rendering', 
        async ()=>{
            //./readme.md:start
            //md: ## conditional rendering
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
            let o_module = await import( './jsh_modules/overlay_window/mod.js');

            let o_state = {
                s: "this is an example state string in a scope", 
                o_dedicated_to_overlay: {}
            };
            let o = await f_o_html__and_make_renderable(
                {
                    a_o: [
                        o_module.f_o_js( // this will add the variables to the state
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
            // // the 
            // window.setInterval(()=>{
            //     o_state.o_dedicated_to_overlay.o_trn.n_x = (Math.random())*window.innerWidth
            //     o_state.o_dedicated_to_overlay.o_trn.n_y = (Math.random())*window.innerHeight
            //     console.log(o_state.o_dedicated_to_overlay.o_js__overlay_window._f_update());
            // }, 1000)
            // console.log(o)
            window.setTimeout(()=>{o_state.o_dedicated_to_overlay.o_scl = new O_vec2(500,500)}, 1000)
            document.body.appendChild(o)

        }
    ), 

    f_o_test(
        "notifire", 
        async ()=>{
            let o_mod_notifire = await import( './jsh_modules/notifire/mod.js');

            let o_state = {
                s: "this is an example state string in a scope", 
                o_dedicated_to_mod: {}
            };
            let o2 = {}
            let o = await f_o_html__and_make_renderable(
                Object.assign(
                    o2,
                    {
                        o_js__everything: {
                            f_o_jsh: ()=>{
                                return {
                                    a_o: [
                                        o_mod_notifire.f_o_js( // this will add the variables to the state
                                            o_state.o_dedicated_to_mod
                                        ), 
                                    ]
                                }
                            }
                        }
                    }
                ).o_js__everything
            )
            document.body.appendChild(o);
            // console.log(o_state.o_dedicated_to_mod)
            // throw a notification with the helper function
            // we have to await the rendering so that the browser render thread can render 
            // if we had a loong loop directly after the throw notification the html would not be rendered without awaiting
            // the problem occuring is is commonly referred to as blocking the main thread or UI thread blocking. It occurs when long-running JavaScript tasks prevent the browser's main thread from updating the user interface, leading to unresponsive pages or delayed updates to the UI.
            await o_mod_notifire.f_o_throw_notification(o_state.o_dedicated_to_mod,'Loading, please wait !', 'loading')
            await o_mod_notifire.f_o_throw_notification(o_state.o_dedicated_to_mod,'Loading 2, please wait !', 'loading')
            await o_mod_notifire.f_o_throw_notification(o_state.o_dedicated_to_mod,'Loading 3, please wait !', 'loading')
            let o4 = o_mod_notifire.f_o_throw_notification(o_state.o_dedicated_to_mod,'Loading 4, please wait !', 'loading')

            let f_some = function(){
                let n = 0; 
                while(n < 10000000000){
                    n +=1;
                    let a = 2; 
                    let b = a*2;
                    let c = a+b; 
                    let d = a/b/c;
                }
            };
            f_some()
            o4.then(o4=>{
                f_clear_o_notification(o4)
            })
            console.log('some done')
            await o_mod_notifire.f_clear_all_notifications(o_state.o_dedicated_to_mod);

            // clear a single notification
            let o_notification = await o_mod_notifire.f_o_throw_notification(o_state.o_dedicated_to_mod,'Click to end this endless loading', 'loading')
            window.addEventListener('pointerdown',async ()=>{
                await o_mod_notifire.f_clear_o_notification(o_notification);
            })
            // // o2.o_js__everything?._f_render()
            // console.log('Loading notifiction should be displayed')
            // // window.setInterval(()=>{

            // //     console.log(o_state.o_dedicated_to_mod.a_o_notification)
            // // },10)
            // console.log(o_state.o_dedicated_to_mod)
            
            // f_clear_all_notifications()

            // // window.setTimeout(function(){
            // //     f_some();
            // // })
            // await o_mod_notifire.f_throw_notification(o_state.o_dedicated_to_mod,'Im living !', 'info')
            // await o_mod_notifire.f_throw_notification(o_state.o_dedicated_to_mod,'Well done !', 'success')
            // await o_mod_notifire.f_throw_notification(o_state.o_dedicated_to_mod,'Watch out !', 'warning')
            // await o_mod_notifire.f_throw_notification(o_state.o_dedicated_to_mod,'OH NO :(  !', 'error')
            // await o_mod_notifire.f_throw_notification(o_state.o_dedicated_to_mod,'Loading, please wait ...', 'loading')
            // await o_mod_notifire.f_throw_notification(`Lorem Ipsum is simply dummy text of the printing and typesetting`);
            // await o_mod_notifire.f_throw_notification(
            //     'Check', 
            //     'info', 
            //     'left', 
            //     'top'
            // );

            // await o_mod_notifire.f_throw_notification(
            //     'me', 
            //     'error', 
            //     'right', 
            //     'top'
            // );
            // await o_mod_notifire.f_throw_notification(
            //     'out', 
            //     'success', 
            //     'right', 
            //     'bottom'
            // );
            // await o_mod_notifire.f_throw_notification(
            //     'Mate!', 
            //     'warning', 
            //     'left', 
            //     'bottom'
            // );
            // await o_mod_notifire.f_throw_notification(
            //     'Hurray!', 
            //     'warning', 
            //     'center', 
            //     'bottom'
            // );


            // window.onmousedown = (o_e)=>{
            //     if(o_e.button == 2){
            //         o_mod_notifire.v_f_clear_notification();   
            //     }
            //     // o_state.o_dedicated_to_mod.a_s_not.push('asdf !')
            //     o_state.o_dedicated_to_mod.a_o_notification.push(
            //         new o_mod_notifire.O_notification(
            //             `It is:  ${new Date().toString()}`, 
            //             ['error', 'info', 'success', 'warning'][parseInt(Math.random()*4)],
            //             ['left', 'right', 'center'][parseInt(Math.random()*3)],
            //             ['bottom', 'top'][parseInt(Math.random()*2)],
            //             true,
            //             ...new Array(2).fill(Math.random()*5000),
            //         )
            //     )
            //     o_state.o_dedicated_to_mod.o_js._f_render()
            // }
        }
    ), 

 
    f_o_test(
        "datepicker", 
        async ()=>{
            
            let o_module = await import( './jsh_modules/datepicker/mod.js');
            
            let o_state = {
                s: "this is an example state string in a scope", 
                o_state__for_module: {

                },
            };

            let o = await f_o_html__and_make_renderable(
                {
                    a_o: [
                        {
                            innerText: "the following is a datepicker"
                        },
                        o_module.f_o_js( // this will add the variables to the state
                            o_state.o_state__for_module
                        ),
                        {
                            innerText: "the following is a datepicker with some custom restrictions"
                        }, 
                        o_module.f_o_js( // this will add the variables to the state
                            Object.assign(
                                o_state,
                                {
                                    o_state__for_module_restrictions: {
                                        a_s_name_month: ['كانُون الثانِي', 'شُباط', 'آذار', 'نَيْسان', 'أَيّار', 'حَزِيران', 'تَمُّوز', 'آب', 'أَيْلُول', 'تِشْرِين الْأَوَّل'],
                                        // b_date_updated_first_time,
                                        o_date: new Date(),// the pre selected date
                                        f_on_update__o_date: ()=>{
                                            console.log('a date has been selected')
                                        },
                                        f_b_selectable: (o_date)=>{
                                            // conditions for date to be selectable, 
                                            // can be crazy like only each second day
                                            return o_date.getUTCDate() % 2 == 0;
                                        },
                                        f_on_click__o_date: ()=>{
                                            console.log('a date has been clicked but maybe it is not selectable')
                                        },
                                        s_text_before_first_select: 'Bitte waehlen sie ein datum',//the text shown before the select
                                        f_s_value_input: (o_state)=>{
                                            if(!o_state.b_date_updated_first_time){
                                                return 'Bitte waehlen sie ein datum'
                                            }
                                            return o_state.o_date.toString()
                                        },
                                        n_selectable_years_plus_minus: 5,//number of years shown before and after
                                    }
                                } 
                            ).o_state__for_module_restrictions  
                        ),
                    ]
                }
            )

            document.body.appendChild(o);
        }
    ), 

    f_o_test(
        "datepicker_on_a_overlay_window", 
        async ()=>{
            
            let o_module__datepicker = await import( './jsh_modules/datepicker/mod.js');
            let o_module__overlay = await import( './jsh_modules/overlay_window/mod.js');

            let o_state = {
                s: "this is an example state string in a scope", 
                o_state__for_overlay1: {n:1}, 
                o_state__for_overlay2: {n:2}, 
                o_state__for_datepicker1: {},
                o_state__for_datepicker2: {}
            };
            window.addEventListener('mousedown', function(){
                window.setTimeout(function(){
                    Object.keys(o_state?.o_state__for_datepicker1).map(s=>{
                        if(s!='o_js'){
                            o_state.o_state__for_datepicker2[s] = o_state?.o_state__for_datepicker1?.[s]
                        }
                    })
                    o_state?.o_state__for_datepicker1?.o_js?._f_render();
                    o_state?.o_state__for_datepicker2?.o_js?._f_render();

                },400)
            })
            // window.o_state = o_state
            let o = await f_o_html__and_make_renderable(
                {
                    a_o: [
                        o_module__overlay.f_o_js( // this will add the variables to the state
                            [
                                {
                                    innerText: "me to drag me!"
                                },
                                o_module__datepicker.f_o_js( // this will add the variables to the state
                                    o_state.o_state__for_datepicker1
                                ),
                            ],
                            o_state.o_state__for_overlay1
                        ), 
                        o_module__overlay.f_o_js( // this will add the variables to the state
                            [
                                {
                                    innerText: "drag me!"
                                },
                                o_module__datepicker.f_o_js( // this will add the variables to the state
                                    o_state.o_state__for_datepicker2
                                ),
                            ], 
                            o_state.o_state__for_overlay2
                        ), 

                    ]
                }
            )
            document.body.appendChild(o)
        }
    ), 
    f_o_test(
        "color_picker", 
        async ()=>{
            
            let o_mod = await import( './jsh_modules/color_picker/mod.js');

            let o_state = {
                s: "this is an example state string in a scope", 
                o_state__color_picker: {}, 
            };

            // window.o_state = o_state
            let o = await f_o_html__and_make_renderable(
                {
                    a_o: [
                        o_mod.f_o_js( // this will add the variables to the state
                            o_state.o_state__color_picker
                        ), 
                    ]
                }
            )
            document.body.appendChild(o)
        }
    ), 
    f_o_test(
        "tooltip", 
        async ()=>{
            
            let o_mod = await import( './jsh_modules/tooltip/mod.js');

            let o_state = {
                s: "this is an example state string in a scope", 
                o_state__tooltip: {}, 
            };

            // window.o_state = o_state
            let o = await f_o_html__and_make_renderable(
                {
                    a_o: [
                        {
                            s_tag: 'h1',
                            innerText: 'hello do me hover!', 
                            data_tooltip: 'i am the tooltip text'
                        },
                        {
                            s_tag:  "img", 
                            src: "https://www.w3schools.com/tags/img_girl.jpg",
                            data_tooltip: 'A girl from behind'
                        },
                        o_mod.f_o_js( // this will add the variables to the state
                            o_state.o_state__tooltip
                        ),
                        {
                            s_tag:'input', 
                            type: "text", 
                            data_tooltip: `text recommended: <br> - yes <br> - no`
                        },
                        {
                            s_tag:  "img", 
                            src: "https://www.w3schools.com/tags/img_girl.jpg",
                            data_tooltip: 'A nother'
                        },
                    ]
                }
            );
            console.log(o_mod.s_css)
            f_add_css(o_mod.s_css)
            document.body.appendChild(o)
        }
    ), 
    f_o_test(
        "weird_rendering", 
        async ()=>{
            
            let o_mod = await import( './jsh_modules/tooltip/mod.js');

            let o_state = {
                s: "this is an example state string in a scope", 
                o_state__tooltip: {}, 
                a_s_rand: new Array(1000).fill(0).map(
                    n=>{
                        return window.crypto.randomUUID()
                    }
                )
            };

            // window.o_state = o_state
            let o = await f_o_html__and_make_renderable(
                {
                    a_o: [
                        {
                            innerText: "asdf",
                        },
                        Object.assign(
                            o_state, 
                            {
                                o_js__complex: {
                                    f_o_jsh: ()=>{

                                        return {
                                            a_o: [
                                                o_state.a_s_rand.map(s=>{
                                                    return {
                                                        innerText: s
                                                    }
                                                })
                                            ]
                                        }
                                    }
                                }
                            }
                        ).o_js__complex
                    ]
                }
            );
            // if _f_render is called multiple times in a short time such that the f_o_jsh execution takes a long time
            // we would need to await the render, but no worries there is a safty 'lock'(o_js._b_rendering && o_js._b_updating) that prevents
            // this, still it will throw a console warning if multiple _f_render after each other before one has finished first 
            o_state.o_js__complex._f_render();
            o_state.o_js__complex._f_render();
            o_state.o_js__complex._f_render();
            o_state.o_js__complex._f_render();
            document.body.appendChild(o)
        }
    ), 
    f_o_test(
        "performance_test_when_attribute_innerhtml_is_set", 
        async ()=>{
            // a test for comparing <div innerText='hello'>hello</div> vs <div>hello</div>
            let n = 200000;
            let o_state = {
                s: "this is an example state string in a scope", 
                o_state__tooltip: {}, 
                a_s_rand: new Array(n).fill(0).map(
                    (n,n_idx)=>{
                        return `rand${n_idx}`
                    }
                )
            };

            // window.o_state = o_state
            let n_ms = window.performance.now();
            let o = await f_o_html__and_make_renderable(
                {
                    a_o: [
                        {
                            innerText: "asdf",
                        },
                        Object.assign(
                            o_state, 
                            {
                                o_js__complex: {
                                    f_o_jsh: ()=>{
                                        return {
                                            a_o: [
                                                o_state.a_s_rand.map(s=>{
                                                    return {
                                                        id: s,
                                                        innerText: s
                                                    }
                                                })
                                            ]
                                        }
                                    }
                                }
                            }
                        ).o_js__complex
                    ]
                }
            );
            let n_ms2 = window.performance.now();
            console.log({
                s: `render delta: ${n_ms2-n_ms} ms`
            })

            n_ms = window.performance.now();
            document.querySelector(`#rand42112`)
            n_ms2 = window.performance.now();
            console.log({
                s: `querySelector delta: ${n_ms2-n_ms} ms`
            })

            document.body.appendChild(o)
        }
    ), 
    f_o_test(
        'error_during_render', 
        async ()=>{
            //./readme.md:start
            //md: ## error test
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
            //./readme.md:end
        }
    ),
    f_o_test(
        "test_function_execution_after_html_element_has_been_rendered_and_appended_to_tree", 
        async ()=>{
            //./readme.md:start
            //md: ## f_after_f_o_html__and_make_renderable
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
            //./readme.md:end
        }
    ), 
    f_o_test(
        "f_before_f_o_html__and_make_renderable", 
        async ()=>{
            //./readme.md:start
            //md: ## f_after_f_o_html__and_make_renderable
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
            //./readme.md:end
        }
    ),
    f_o_test(
        "manual_scalable_dragable_window", 
        async ()=>{
            

            let o_state = {
                s: "this is an example state string in a scope", 
                o_state__color_picker: {},
                b_scale: false, 
                b_translate: false,
                o_pd: {n_x: 0, n_y:0}, 
                o_scl: {n_x: 100, n_y: 100},
                o_trn: {n_x: 100, n_y: 100}, 
                o_scl_pd: {n_x: 0, n_y: 0},
                o_trn_pd: {n_x: 0, n_y: 0},
            };
            let f_o_assigned = function(s, o, o2){
                return Object.assign(
                    o2, 
                    {
                        [s]: o
                    }
                )[s]
            }
            window.onpointerup = function(){
                o_state.b_scale = false;
                o_state.b_translate = false;
            }
            window.onpointermove = async function(o_e){
                
                let o_diff_scl_x = o_state.o_pd.n_x - o_e.clientX;
                let o_diff_scl_y = o_state.o_pd.n_y - o_e.clientY;
                let o_diff_trn_x = o_state.o_trn_pd.n_x - o_e.clientX;
                let o_diff_trn_y = o_state.o_trn_pd.n_y - o_e.clientY;
                
                let o_diff_trn_x2 = o_state.o_trn_pd.n_x - o_state.o_pd.n_x;
                let o_diff_trn_y2 = o_state.o_trn_pd.n_y - o_state.o_pd.n_y;

                let o_diff_scl_x2 = o_state.o_scl_pd.n_x - o_state.o_pd.n_x;
                let o_diff_scl_y2 = o_state.o_scl_pd.n_y - o_state.o_pd.n_y;

                if(o_state.b_scale){
                    o_state.o_scl.n_x = o_state.o_scl_pd.n_x-o_diff_scl_x;
                    o_state.o_scl.n_y = o_state.o_scl_pd.n_y-o_diff_scl_y;
                    await o_state.o_js__translatable_scalable_window._f_update();
                }
                if(o_state.b_translate){
                    o_state.o_trn.n_x = o_state.o_trn_pd.n_x-o_diff_trn_x+o_diff_trn_x2;
                    o_state.o_trn.n_y = o_state.o_trn_pd.n_y-o_diff_trn_y+o_diff_trn_y2;
                    await o_state.o_js__translatable_scalable_window._f_update();
                }
            }
            let f_update_pointerdown = function(o_e){
                o_state.o_pd = {n_x: o_e.clientX, n_y: o_e.clientY}
                o_state.o_scl_pd = Object.assign({}, o_state.o_scl)
                o_state.o_trn_pd = Object.assign({}, o_state.o_trn)
            }
            let f_update_pointerdown_scl = function(o_e){
                o_state.b_scale = true;
                f_update_pointerdown(o_e);
            }
            let f_update_pointerdown_trn = function(o_e){
                o_state.b_translate = true;
                f_update_pointerdown(o_e);
            }
            // window.o_state = o_state
            let o = await f_o_html__and_make_renderable(
                {
                    a_o: [
                        f_o_assigned(
                            'o_js__translatable_scalable_window', 
                            {
                                f_o_jsh: async ()=>{
                                    console.log('asdf')
                                    return {
                                        style: [
                                            "background-color: red",
                                            `position: absolute`, 
                                            `left: ${o_state.o_trn.n_x}px`,
                                            `top:${o_state.o_trn.n_y}px`, 
                                            `width:${o_state.o_scl.n_x}px`,
                                            `height: ${o_state.o_scl.n_y}px`
                                        ].join(';'),
                                        a_o: [
                                            {innerText: "drag me"}, 
                                            {
                                                s_tag: "button", 
                                                innerText: "translate", 
                                                onpointerdown: (o_e)=>{
                                                    f_update_pointerdown_trn(o_e);
                                                }
                                            },
                                            {
                                                s_tag: "button", 
                                                innerText: "scale",
                                                onpointerdown: (o_e)=>{
                                                    f_update_pointerdown_scl(o_e);
                                                }
                                            }
                                        ]
                                    }
                                }
                            },
                           o_state 
                        )
                    ]
                }
            )
            document.body.appendChild(o)
        }
    ),
    f_o_test(
        "translatable_scalable_window", 
        async ()=>{
            let o_module = await import( './jsh_modules/translatable_scalable_window/mod.js');

            let o_state = {
                s: "this is an example state string in a scope", 
                o_dedicated_to_overlay: {
                    o_scl: {n_x: 500, n_y: 500}, 
                    o_trn: {n_x: 200, n_y: 200}, 
                    a_s_css_propval: [
                        'background: blue'
                    ]
                }
            };
            let o = await f_o_html__and_make_renderable(
                {
                    a_o: [
                        o_module.f_o_js( // this will add the variables to the state
                            [
                            ... (new Array(20)).fill(0).map(
                                n =>{
                                    let s_rel_x = ['left', 'right'][parseInt(Math.random()*2)]
                                    let s_rel_y = ['top', 'bottom'][parseInt(Math.random()*2)]
                                    let n_x_nor = Math.random()*50;
                                    let n_y_nor = Math.random()*50;
                                    let s = ['scl', 'trn'][parseInt(Math.random()*2)];

                                    return {
                                        s_tag: "button", 
                                        style: `position:absolute; ${s_rel_x}:${n_x_nor}%;${s_rel_y}:${n_y_nor}%`,
                                        onpointerdown: (o_e)=>{o_module[`f_update_pointerdown_${s}`](
                                            o_state.o_dedicated_to_overlay, 
                                            o_e
                                        )},
                                        innerText: s
                                      }
                                }
                            ),
                              {
                                s_tag: "button", 
                                style: "position:absolute; top:0;left:0",
                                onpointerdown: (o_e)=>{o_module.f_update_pointerdown_scl(
                                    o_state.o_dedicated_to_overlay, 
                                    o_e
                                )},
                                innerText: 'scale',
                              }, 
                              {
                                s_tag: "button", 
                                style: "position:absolute; top:0;right:0",
                                onpointerdown: (o_e)=>{o_module.f_update_pointerdown_trn(
                                    o_state.o_dedicated_to_overlay, 
                                    o_e
                                )},
                                innerText: 'translate',
                              },
                              {
                                s_tag: "button", 
                                style: "position:absolute; bottom:0;right:0",
                                onpointerdown: (o_e)=>{o_module.f_update_pointerdown_scl(
                                    o_state.o_dedicated_to_overlay, 
                                    o_e
                                )},
                                innerText: 'scl',
                              }, 
                              {
                                s_tag: "button", 
                                style: "position:absolute; bottom:0;left:0",
                                onpointerdown: (o_e)=>{o_module.f_update_pointerdown_trn(
                                    o_state.o_dedicated_to_overlay, 
                                    o_e
                                )},
                                innerText: 'translate',
                              },  
                            ], 
                            o_state.o_dedicated_to_overlay
                        ), 
                    ]
                }
            )

            document.body.appendChild(o)

        }
    ), 
]




f_display_test_selection_or_run_selected_test_and_print_summary(
    a_o_test
)