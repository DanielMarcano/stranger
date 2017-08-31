<?php

/**
  * @author Daniel Marcano danielmarcanodev@gmail.com
**/


$category = isset($_POST['category']) ? $_POST['category'] : '';

function get_images($category) {
  $dir = "images/${category}/";
  $dh  = opendir($dir);
  while (false !== ($filename = readdir($dh))) {
    $new_name = strstr($filename, '.', true);
    $files[] = $new_name;
  }
  $images = $files;
  $images = preg_grep ("/[0-9]/", $files);

  closedir($dh);
  return $images;

};

$response['images'] = get_images($category);
$response['category'] = $category;

echo json_encode($response);
