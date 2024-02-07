import {
    f_add_css,
    f_s_css_prefixed,
} from "https://deno.land/x/f_add_css@1.1/mod.js"

import { 
    f_s_selector_css_from_s_uuid
} from "../functions.module.js"
let s_class = 'datepicker';
let s_prop_o_js = 'o_js'//`o_js__${s_class}`;
let s_uuid_module_scope = f_s_selector_css_from_s_uuid(crypto.randomUUID());

let f_throw_notification = null;  

let o_s_type_s_ascii_icon = {
    'success': '✓',
    'warning': '⚠',
    'info': "ℹ", 
    'error': '✖'
}
let a_s_position_x = ['left', 'center', 'right']
let a_s_position_y = ['top', 'bottom']

let f_b_same_day = function(
    o_date_1, 
    o_date_2
){
    return o_date_1.getUTCFullYear() == o_date_2.getUTCFullYear()
        && o_date_1.getUTCMonth() == o_date_2.getUTCMonth()
        && o_date_1.getUTCDate() == o_date_2.getUTCDate()
}

var f_s_ymd_from_n_ts_ms = function(
    n_ts_ms,
    b_localtime = false
){
    
    var o_date  = new Date(n_ts_ms);

    var s_y = o_date.getUTCFullYear();
    var s_m = (o_date.getUTCMonth()+1).toString().padStart(2,'0');
    var s_d = (o_date.getUTCDate()).toString().padStart(2,'0');
    if(b_localtime){
        s_y = o_date.getUTCFullYear();
        s_m = (o_date.getUTCMonth()+1).toString().padStart(2,'0');
        s_d = (o_date.getUTCDate()).toString().padStart(2,'0');
    }
    var s_ymd = `${s_y}-${s_m}-${s_d}`;

    return s_ymd;
    
}
let f_f_s_value_input__prompt_before_first_select = function(){
    return (o_state) =>{
        if(!o_state.b_date_updated_first_time){
            return o_state.s_text_before_first_select
        }
        return f_s_ymd_from_n_ts_ms(
            o_state?.o_date?.getTime(), 
            true
        )
    }
}
let f_o_js = function(
    o_state = {}
){

    Object.assign(
        o_state, 
        {
            //
            // o_js__active: {
            //     f_o_jsh: ()=>{return {}}
            // },
            [s_prop_o_js]:  {
                f_o_jsh: ()=>{
                    return {
                        class: [
                            s_uuid_module_scope, 
                            o_state?.s_uuid_function_scope, 
                        ].join(' '),
                        a_o: [
                            {
                                class: 'position_relative theme_dark', 
                                a_o:[
                                    Object.assign(
                                        o_state, 
                                        {
                                            o_js__input: {
                                                f_o_jsh: function(){
                                        
                                                    return {
                                                        class: "input",
                                                        a_o: [
            
                                                            {
                                                                s_tag: "input", 
                                                                readonly: 'true',
                                                                class: "clickable p-1_2_rem",
                                                                type: "text",
                                                                value: o_state.f_s_value_input(o_state),
                                                                onmousedown: function(){
                                                                    o_state.b_show_picker = true
                                                                    o_state?.o_js__s_name_month_n_year._f_render();
                                                                }
                                                            },
                                                            {
                                                                s_tag: 'i',
                                                                class: "fa-regular fa-calendar icon clickable p-1_2_rem", 
                                                                onmouseup: function () {
                                                                    
                                                                    o_state.b_show_picker = true;
                                                                    o_state?.o_js__s_name_month_n_year._f_render();
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }
                                            }
                                        }
                                    ).o_js__input,
                                    Object.assign(
                                        o_state, 
                                        {
                                            o_js__s_name_month_n_year: {
                                                f_o_jsh:function(){
                                                    o_state?.o_js__active?._f_render?.()
                                                    return {
                                                        class:  "o_js__s_name_month_n_year border_shadow_popup",
                                                        a_o: [
                                                            {
                                                                style: (!o_state.b_show_picker) ? 'display:none' : '',
                                                                // b_render: o_state.b_show_picker,
                                                                a_o:[
                                                                    {
                                                                        class: "o_js__s_name_month_n_year_nav", 
                                                                        a_o:[
                                                                            {
                                                                                class: [
                                                                                    'p-1_2_rem',
                                                                                    'clickable'
                                                                                ].join(' '),
                                                                                innerText: "<", 
                                                                                onclick: function(){
                                                                                    o_state._o_date__being_selected = new Date(
                                                                                        o_state._o_date__being_selected.setUTCMonth(
                                                                                            o_state._o_date__being_selected.getUTCMonth()-1
                                                                                        )
                                                                                    );
                                                                                    o_state?.o_js__s_name_month_n_year._f_render()
                                                                                }
                                                                            },
                                                                            {
                                                
                                                                                class: [
                                                                                    'p-1_2_rem',
                                                                                    'clickable'
                                                                                ].join(' '),
                                                                                innerText: o_state.a_s_name_month[o_state._o_date__being_selected.getUTCMonth()].substring(0,3), 
                                                                                onclick: function(){
                                                                                    //switch to monmth view
                                                                                    o_state.o_js__active = o_state?.o_js__a_s_name_month
                                                                                    o_state?.o_js__s_name_month_n_year._f_render()
                                                                                }
                                                                            },
                                                                            {
                                                                                class: [
                                                                                    'p-1_2_rem',
                                                                                    'clickable'
                                                                                ].join(' '),
                                                                                innerText: ">", 
                                                                                onclick: function(){
                                                                                    o_state._o_date__being_selected = new Date(
                                                                                        o_state._o_date__being_selected.setUTCMonth(
                                                                                            o_state._o_date__being_selected.getUTCMonth()+1
                                                                                        )
                                                                                    );
                                                                                    o_state?.o_js__s_name_month_n_year._f_render()
                                                                                }
                                                                            },
                                                                            {
                                                                                class: [
                                                                                    'p-1_2_rem',
                                                                                    'clickable'
                                                                                ].join(' '),
                                                                                innerText: o_state._o_date__being_selected.getUTCFullYear(), 
                                                                                onclick: function(){
                                                                                    //switch to year view
                                                                                    o_state.o_js__active = o_state?.o_js__a_n_year
                                                                                    o_state?.o_js__s_name_month_n_year._f_render()
                                                                                }
                                                                            },
                                                                        ]
                                                                    },
                                                                    {
                                                                        f_o_jsh: o_state?.o_js__active?.f_o_jsh
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                }
                                            }
                                        }
                                    ).o_js__s_name_month_n_year,
                                ], 
                                onmouseup: function(){
                                    o_state.b_show_picker = true;
                        
                                }
                            },
                        ]
                    }

                }
            },
            // state
            b_date_updated_first_time:
                (o_state.b_date_updated_first_time) 
                    ? o_state.b_date_updated_first_time
                    : false,
            o_date:
                (o_state.o_date) 
                    ? o_state.o_date
                    : new Date(),
            f_on_update__o_date: 
                (o_state.f_on_update__o_date) 
                    ? o_state.f_on_update__o_date 
                    : ()=>{},
            f_b_selectable: 
                (o_state.f_b_selectable) 
                    ? o_state.f_b_selectable 
                    : ()=>{return true},
            f_on_click__o_date: 
                (o_state.f_on_click__o_date) 
                    ? o_state.f_on_click__o_date 
                    : ()=>{},
            n_ts_ms__from: 
                (o_state.n_ts_ms__from) 
                    ? o_state.n_ts_ms__from 
                    : null,
            n_ts_ms__to: 
                (o_state.n_ts_ms__to) 
                    ? o_state.n_ts_ms__to 
                    : null,
            s_text_before_first_select:
                (o_state.s_text_before_first_select) 
                    ? o_state.s_text_before_first_select 
                    : 'Select date', 
            f_s_value_input: 
                (o_state.f_s_value_input) 
                    ? o_state.f_s_value_input 
                    : f_f_s_value_input__prompt_before_first_select(),
            _o_date__being_selected: 
                (o_state._o_date__being_selected) 
                    ? o_state._o_date__being_selected 
                    : new Date(),
            b_show_picker: 
                (o_state.b_show_picker) 
                    ? o_state.b_show_picker 
                    : false,
            a_s_name_month: 
                (o_state.a_s_name_month) 
                    ? o_state.a_s_name_month 
                    : ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"],
            n_selectable_years_plus_minus: 
                (o_state.n_selectable_years_plus_minus) 
                    ? o_state.n_selectable_years_plus_minus 
                    : 10,
            a_n_year: 
                (o_state.a_n_year) 
                    ? o_state.a_n_year 
                    : [],
            // 
            s_uuid_function_scope: 
                (o_state.s_uuid_function_scope) 
                    ? o_state.s_uuid_function_scope 
                    : f_s_selector_css_from_s_uuid(crypto.randomUUID()),

            s_uuid_module_scope,
        }
    )

    Object.assign(
        o_state, 
        {
            o_js__a_s_name_month : {
                f_o_jsh: function(){
                    return {
                        class: "a_s_name_month d_flex",
                        a_o:[
                            ...o_state.a_s_name_month.map(
                                function(s_name_month){
                                    var n_idx_month = o_state.a_s_name_month.indexOf(s_name_month);
                                    var o_date_month = new Date(new Date().setUTCMonth(n_idx_month));
        
                                    var b_selectable = true;//we would need to check every day of month if it is selectable, if even one day is selectable the whole month is selectable //o_state.f_b_selectable(o_date_month);
                                    let b_same_month = o_state.o_date.getUTCMonth() == o_date_month.getUTCMonth();
                                    let b_clickable = b_selectable;
                                    let b_clicked = b_same_month;
        
                                    return {
                                        class: [
                                            "s_name_month", 
                                            ((b_clickable) ? 'clickable' : ''), 
                                            ((b_clicked) ? 'clicked' : ''), 
                                            'w_1_t_3',
                                            'pt-0_9_rem',
                                            'pb-0_9_rem',
                                        ].join(' '),
                                        innerText: s_name_month,
                                        onclick: function(){
                                            o_state._o_date__being_selected = new Date(
                                                o_state._o_date__being_selected.setUTCMonth(n_idx_month)
                                            );
                                            o_state.o_js__active = o_state?.o_js__a_s_name_day;
                                            o_state?.o_js__s_name_month_n_year._f_render();
                                        }
                                    };
                                }
                            )
                        ]
                    }
                }
            }
        }
    )
    Object.assign(
        o_state, 
        {
            o_js__a_s_name_day : {
                f_o_jsh: function(){
                    var o_date = o_state._o_date__being_selected;
                    var o_date_last_day_of_month = new Date(
                        Date.UTC(
                            o_date.getUTCFullYear(),
                            o_date.getUTCMonth()+1,
                            0,
                        )
                    );
                    var o_date_first_day_of_month = new Date(
                        Date.UTC(
                            o_date.getUTCFullYear(),
                            o_date.getUTCMonth(),
                            1,
                        )
                    );
                    var o_date_start = o_date_first_day_of_month;
                    let n_ms__one_day = 24*60*60*1000;
                    while(o_date_start.getUTCDay() != 1){
                        o_date_start = new Date(o_date_start.getTime()-n_ms__one_day)
                    }
        
                    var o_date_end = o_date_last_day_of_month;
                    while(o_date_end.getUTCDay() != 0){
                        o_date_end = new Date(o_date_end.getTime()+n_ms__one_day)
                    }
                    var a_o_date_day = [];
                    var o_date_it = o_date_start; 
                    while(o_date_it.getTime() <= o_date_end.getTime()){
                        a_o_date_day.push(o_date_it)
                        o_date_it = new Date(o_date_it.getTime()+n_ms__one_day);
                    }
                    var a_s_name_day = [
                        "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"
                    ];
                    return {
                        a_o:[
                            {
                                "class": [
                                    "a_s_name_day", 
                                    'd_flex'
                                ].join(" "),
                                a_o: [
                                    ...a_s_name_day.map(function(s_name_day){
                                        return {
                                            class: [
                                                "w_1_t_7",
                                                'pt-0_9_rem',
                                                'pb-0_9_rem',
                                            ].join(" "),
                                            innerText: s_name_day
                                        }
                                    })
                                ]
                            }, 
                            {
                                "class": [
                                    "a_o_date_day", 
                                    'd_flex'
                                ].join(" "),
                                a_o: [
                                    ...a_o_date_day.map(function(o_date_day){
                                        var b_selectable = o_state.f_b_selectable(o_date_day);
                                        var b_day_of_this_month = o_date_day.getUTCMonth() == o_state._o_date__being_selected.getUTCMonth();
                                        let b_same_day = f_b_same_day(o_date_day, o_state.o_date);
                                        let b_clickable = b_day_of_this_month && b_selectable;
                                        let b_clicked = b_same_day;
                                        return {
                                            class: [
                                                `w_1_t_7`,
                                                'pt-0_9_rem',
                                                'pb-0_9_rem',
                                                ((b_clickable) ? 'clickable' : ''), 
                                                ((b_clicked) ? 'clicked' : ''), 
                                            ].join(" "),
                                            innerText: (b_day_of_this_month) ? o_date_day.getUTCDate(): '',//.toString().padStart(2,'0'), 
                                            onclick: function(){
                                                if(!b_day_of_this_month){
                                                    return
                                                }
        
                                                o_state._o_date__being_selected = o_date_day;
                                                
                                                if(b_selectable){
                                                    o_state.o_date = new Date(o_date_day.getTime())
                                                    o_state.b_date_updated_first_time = true;
                                                    o_state.f_on_update__o_date(
                                                        o_state.o_date
                                                    );
                                                    o_state.b_show_picker = false;
                                                    o_state?.o_js__s_name_month_n_year._f_render();
                                                }
                                                o_state.f_on_click__o_date(
                                                    o_date_day
                                                );
                                                o_state?.o_js__a_s_name_day?._f_render?.()
                                                o_state?.o_js__input._f_render();
                                            }
                                        }
                                    })
                                ]
                            }, 
                        ]
                    }
        
                }
            }
        }
    )
    Object.assign(
        o_state, 
        {
            o_js__a_n_year : {
                f_o_jsh: function(){
                    return {
                        class: "a_n_year d_flex",
                        a_o:[
                            ...o_state.a_n_year.map(
                                function(n_year){
                                    
                                    var b_selectable = true;//n_year == o_state.o_date.getUTCFullYear()
                                    //we would need to check if the date is selectable for every day in the year to know if a year is selectable/clickable
        
                                    let b_clickable = b_selectable;
                                    var o_date_year = new Date(new Date().setUTCFullYear(n_year));
                                    let b_clicked = o_date_year.getFullYear() == o_state._o_date__being_selected.getFullYear();
        
                                    return {
                                        class: [
                                            "n_year", 
                                            'w_1_t_3',
                                            'pt-0_9_rem',
                                            'pb-0_9_rem',
                                            ((b_clickable) ? 'clickable' : ''), 
                                            ((b_clicked) ? 'clicked' : ''), 
        
                                        ].join(' '),
                                        innerText: n_year,
                                        onclick: function(){
        
                                            o_state._o_date__being_selected = new Date(
                                                o_state._o_date__being_selected.setUTCFullYear(n_year)
                                            );
                                            o_state.o_js__active = o_state?.o_js__a_s_name_day;
                                            o_state?.o_js__s_name_month_n_year._f_render();
        
                                        }
                                    };
                                }
                            )
                        ]
                    }
                }
            }
        }
    )
    let o_date_minus = new Date(o_state.o_date.getTime());
    let o_date_plus = new Date(o_state.o_date.getTime());
    o_state.a_n_year.push(o_state.o_date.getUTCFullYear())
    for(var n_it = 0; n_it < o_state.n_selectable_years_plus_minus; n_it+=1){
        o_date_minus = new Date( o_date_minus.setUTCFullYear(o_date_minus.getUTCFullYear()-1))
        o_date_plus = new Date( o_date_plus.setUTCFullYear(o_date_plus.getUTCFullYear()+1))
        o_state.a_n_year.push(
            o_date_minus.getUTCFullYear(), 
            o_date_plus.getUTCFullYear()
        )
    }
    o_state.a_n_year.sort((n1, n2)=>n1-n2)

    window.addEventListener("mouseup", function(){
        let o = (window.event.target.closest("."+o_state.s_uuid_function_scope));
        if(!o){
            o_state.b_show_picker = false;
            o_state?.o_js__s_name_month_n_year._f_render();
        }
    })

    o_state.o_js__active =  o_state?.o_js__a_s_name_day 
    return o_state[s_prop_o_js]
}
// css for only this module
let s_selector_classscope = `.${[s_class].join('.')}`
let s_selector_modscope = `.${[s_class, s_uuid_module_scope].join('.')}`
// let s_selector_functionscope = `.${[s_class, s_uuid_module_scope, s_uuid_function_scope].join('.')}`

let s_color_clicked = 'rgb(174,203,250)'
let s_color_clickable = 'rgb(241,243,244)'
let s_color_clicked_clickable = 'rgb(138,180,248)';

let s_color_clicked__dark = 'rgb(126,180,201)'
let s_color_clickable__dark = '#282828'
let s_color_clicked_clickable__dark = '#4d4d4d';

let s_css = `
.position_relative{
    position:relative
}
.o_js__s_name_month_n_year{
    position:absolute;
    top:100%;
    left:0;
    width:100%;
}
input{
    border:none;
    outline:none;
    flex: 1 1 auto;
}
.input{
    display:flex;
}

.d_flex{
    display: flex;
    flex-wrap: wrap;
}

.w_1_t_7{
    align-items: center;
    display: flex;
    justify-content: center;
    flex: 1 1 calc(100%/7);
}

.w_1_t_3{
    align-items: center;
    display: flex;
    justify-content: center;
    flex:1 1 calc(100%/3);
}
*{
    font-size: 1.2rem;
    color: rgb(25 25 25 / 50%);
    background:white;
}
.border_shadow_popup{
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
}
.theme_dark .border_shadow_popup{
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
}
${['clickable'].map(
    s=>`
    .${s}{
        border-radius:3px;
        color: rgb(18 18 18 / 90%)
    }
    .${s}:hover{
        background-color: ${s_color_clickable};
        cursor:pointer;
        color: rgb(18 18 18 / 90%)
    }
    .${s}.clicked{
        background-color: ${s_color_clicked};
        cursor:pointer;
        color: rgb(18 18 18 / 90%)
    }
    .${s}.clicked:hover{
        background-color: ${s_color_clicked_clickable};
        cursor:pointer;
        color: rgb(18 18 18 / 90%)
    }
    `
).join('\n')}
.theme_dark * {
    background: rgba(18,18,18, 1.0);
    color: rgba(143, 143, 143, 1.0);
}
${['.theme_dark .clickable'].map(
    s=>`
    ${s}{

        border-radius:3px;
        color: rgb(243 243 243 / 90%);
    }
    ${s}:hover{
        background-color: ${s_color_clickable__dark};
        cursor:pointer;
        color: rgb(243 243 243 / 90%);
    }
    ${s}.clicked{
        background-color: ${s_color_clicked__dark};
        cursor:pointer;
        color: rgb(243 243 243 / 90%);
    }
    ${s}.clicked:hover{
        background-color: ${s_color_clicked_clickable__dark};
        cursor:pointer;
        color: rgb(243 243 243 / 90%);
    }
    `
).join('\n')}
div {
    font-family:helvetica;
}
${(new Array(20).fill(0)).map(
    function(n, n_idx){
        let num = (n_idx /10)
        let s_n = num.toString().split('.').join('_');
        return `
            .p-${s_n}_rem{padding: ${num}rem}
            .pl-${s_n}_rem{padding-left: ${num}rem}
            .pr-${s_n}_rem{padding-right: ${num}rem}
            .pt-${s_n}_rem{padding-top: ${num}rem}
            .pb-${s_n}_rem{padding-bottom: ${num}rem}
        `
    }
).join("\n")} 
.o_js__s_name_month_n_year{
    z-index:1;
}
.o_js__s_name_month_n_year{
    max-width:500px;
}
.o_js__s_name_month_n_year_nav{
    display:flex;
}
.test{
    color: red;
}
`;
f_add_css(
    f_s_css_prefixed(
        s_css,
        `.${s_uuid_module_scope}`
    )
)

f_add_css('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');


export {
    f_o_js,
    s_css, 
}