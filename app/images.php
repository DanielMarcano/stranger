<?php

$category = isset($_POST['category']) ? $_POST['category'] : '';

function get_images($category) {
  $dir = "images/${category}/";
  $dh  = opendir($dir);
  while (false !== ($filename = readdir($dh))) {
      $files[] = $filename;
  }
  $images = preg_grep ("/\A'.jpg'/i", $files);
  closedir($dh);
  return $images;
};

$response['images'] = get_images('');

echo json_encode($response);
 ?>
