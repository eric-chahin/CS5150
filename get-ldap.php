<?php
$netid=$_SERVER['REMOTE_USER'];

$ds=ldap_connect("directory.cornell.edu");
    
if ($ds) {
    $r = ldap_bind($ds);
    $sr = ldap_search($ds, "ou=People,o=Cornell University,c=US","uid=$netid");
    $info = ldap_get_entries($ds, $sr);
    $entry = ldap_first_entry($ds, $sr);
    if ($attrs = ldap_get_attributes($ds, $entry)) {
        $firstName = $info[0]["givenname"][0];
        $lastName = $info[0]["sn"][0];
        $middleName = $info[0]["cornelledumiddlename"][0];
        
        // user info is encoded as <netid> ; <name> 
        echo json_encode($netid.";".$firstName." ".$lastName);
    }
}
?>