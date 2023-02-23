
    //readme.md:start
    //md:# convert js /json to html

    
    //readme.md:end
    var s_js_f_o_html_from_o_js = await Deno.readTextFile("./f_o_html_from_o_js.module.js");
    var s_js_client_test = await Deno.readTextFile("./client_test.js");
    var s_html = `
    <!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]>      <html class="no-js"> <!--<![endif]-->
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>test </title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="">
    </head>
    <body>
        <!--[if lt IE 7]>
            <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="#">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->
        
        <script type="module">
        ${s_js_f_o_html_from_o_js}
        ${s_js_client_test}
        </script>
    </body>
</html>
`

await Deno.writeTextFile("./o_html.html", s_html);
