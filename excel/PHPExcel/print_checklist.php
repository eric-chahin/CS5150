<?php
/**
 *  Checklist Interactive is using PHPExcel, which has its license declared below.
 *  This php file is intended to
 *      1. send an email to the administrator
 *                       OR
 *      2. send a pdf to the user so that they can print it
 *
 * PHPExcel
 *
 * Copyright (C) 2006 - 2014 PHPExcel
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * @category   PHPExcel
 * @package    PHPExcel
 * @copyright  Copyright (c) 2006 - 2014 PHPExcel (http://www.codeplex.com/PHPExcel)
 * @license    http://www.gnu.org/licenses/old-licenses/lgpl-2.1.txt  LGPL
 * @version    1.8.0, 2014-03-02
 */

/** Error reporting */
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);

define('EOL',(PHP_SAPI == 'cli') ? PHP_EOL : '<br />');

$DIRECTORY_OF_CHECKLIST_TEMPLATES = '../checklist_templates/';

/** Include PHPExcel */
require_once dirname(__FILE__) . '/Classes/PHPExcel.php';
require_once dirname(__FILE__) . '/Classes/PHPExcel/IOFactory.php';
require_once('../PHPMailer/class.phpmailer.php');

$admin_name  = $_POST['name'];//TODO: Get the Admin's name!
$admin_netid = $_POST['netid'];//TODO: Get the Admin's netid!
$users_name = $_POST['name'];
$netid = $_POST['netid'];
$version_checklist = $DIRECTORY_OF_CHECKLIST_TEMPLATES.$_POST['version'].".xls"; //TODO get correct version
if (!file_exists($version_checklist)) {
  exit("The checklist you are looking for, ".$version_checklist.", does not exist." . EOL);
}

echo date('H:i:s') , " Load from Excel2007 file" , EOL;
$objPHPExcel = PHPExcel_IOFactory::load($version_checklist);


//creating PDF section (written by Ben)
$rendererName = PHPExcel_Settings::PDF_RENDERER_MPDF;
$rendererLibrary = 'mpdf.php';
$rendererLibraryPath = dirname(__FILE__).'/MPDF57/' . $rendererLibrary;

if (!PHPExcel_Settings::setPdfRenderer(
    $rendererName,
    $rendererLibraryPath
    )) {
        die(
            'NOTICE: Please set the $rendererName and $rendererLibraryPath values' .
            '<br />' .
            'at the top of this script as appropriate for your directory structure'
        );
}

$objWriter = PHPExcel_IOFactory::createWriter($objPHPexcel, 'PDF');
$objWriter->writeAllSheets();
$objWriter->setPreCalculateFormulas(false);
$objWriter->save('php://output');

//end of creating pdf section


// Add some data
echo date('H:i:s') , " Add some data" , EOL;

// $objPHPExcel->getActiveSheet()->setCellValue('A8',"Hello\nWorld");

// foreach($_POST['cells'] as $key => $value) {
//   $objPHPExcel->setActiveSheetIndex(0)->setCellValue($key,$value);
// }


// Set active sheet index to the first sheet, so Excel opens this as the first sheet
$objPHPExcel->setActiveSheetIndex(0);

/*
 *
 *   Saving the file!
 *   Uncomment the lines below to get the 2007 format
 */

// Save Excel 2007 file
// echo date('H:i:s') , " Write to Excel2007 format" , EOL;
// $callStartTime = microtime(true);

// $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
// echo str_replace('.php', '.xlsx', __FILE__);
// $objWriter->save(str_replace('.php', '.xls', __FILE__));
// $callEndTime = microtime(true);
// $callTime = $callEndTime - $callStartTime;

// echo date('H:i:s') , " File written to " , str_replace('.php', '.xlsx', pathinfo(__FILE__, PATHINFO_BASENAME)) , EOL;
// echo 'Call time to write Workbook was ' , sprintf('%.4f',$callTime) , " seconds" , EOL;
// // Echo memory usage
// echo date('H:i:s') , ' Current memory usage: ' , (memory_get_usage(true) / 1024 / 1024) , " MB" , EOL;


// Save Excel 95 file
echo date('H:i:s') , " Writing to Excel5 format..." , EOL;

$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
$objWriter->save('../user_checklists/'.$netid.'.xls');

echo 'Sending email...', EOL;
$from_email_addr = $netid.'@cornell.edu';
$to_email_addr   = $admin_netid.'@cornell.edu';
$subject         = "Checklist Interactive: ".$users_name." sent you their checklist for review";
$to = $to_email_addr.', '.$from_email_addr;
$headers = 'From: '.$from_email_addr. "\r\n" .
    'Reply-To: '.$from_email_addr. "\r\n" .
    'X-Mailer: PHP/' . phpversion();
$msg = '
Hello,

This is an automated message from Checklist Interactive. '.$users_name.'
would like you to check their checklist. Please, see the attached file.

Thank you,
The Checklist Interactive Staff
';
// echo $to;
// echo $subject;
// echo $headers;
// echo $msg;
// echo mail($to,$subject,$msg,$headers);

$email = new PHPMailer();
$email->From       = $from_email_addr;
$email->FromName   = $users_name;
$email->Subject    = $subject;
$email->Body       = $msg;
$email->AddAddress($to_email_addr, $admin_name);
$email->AddAddress($from_email_addr, $users_name);
$file_to_attach = '../user_checklists/'.$netid.'.xls';

$email->AddAttachment( $file_to_attach );
if (!$email->Send()) {
  echo "Problem occurred with PHPMailer";
} else {
  echo 'Mail was sent!';
}
?>