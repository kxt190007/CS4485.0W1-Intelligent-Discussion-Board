<!DOCTYPE html>
<html lang="en">

<?php
$classes = ['CS4344', 'SE3345','HIST 2144', 'ARTS 2331'];
?>

<head>
    <title>Page Title</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <!-- import css -->
    <link rel="stylesheet" href="style.css" />
    <!-- import js -->
    <script src="/script.js" defer></script>
</head>
<body>
<h1>
    <center>HomePage</center>
</h1>
<p>By team 12</p>
<nav>
    <center>
        <li><a href="./index.php">Home</a></li>

        <li> <a href="./login.html">Login</a></li>
        <li> <a href="./create.html">Create</a></li>
    </center>
</nav>

<nav>
    <?php for($i = 0; $i < sizeof($classes); $i++) {?>
        <li><a href = "./classBoard.php"><?= $classes[$i] ?></a> </li>
    <?php }?>
</nav>

</body>
</html>