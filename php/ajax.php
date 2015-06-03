<?php

include('db.class.php');

/*
$benutzer = "%".$_SERVER['REMOTE_USER']."%";
$sql = 'SELECT * from benutzer n where b.kurz like :usernr';
$stmt = $db->prepare($sql);
$stmt->bindParam('usernr',$benutzer,PDO::PARAM_STR);
$stmt->execute();
$result = $stmt->fetch(PDO::FETCH_ASSOC);
$benutzer = $result['id'];
*/

$erfasser = 1;

if($_POST['action'] == 'saveHieb')
{
	
	$datum  = date("Y-m-d 00:00:00", strtotime($_POST['kopfdaten']['datum']));

	$sql = 'INSERT INTO hieb (name, bestand, erfasser, datum) VALUES (:name, :bestand, :erfasser, :datum);';

	$stmt = $db->prepare($sql);

	$stmt->bindParam(':name', $_POST['kopfdaten']['name'], PDO::PARAM_STR);

	$stmt->bindParam(':bestand', $_POST['kopfdaten']['bestand'], PDO::PARAM_STR);

	$stmt->bindParam(':erfasser', $erfasser, PDO::PARAM_INT);
	
	$stmt->bindParam(':datum', $datum, PDO::PARAM_STR);

	$stmt->execute();
	
	$error = $stmt->errorInfo();

	$return['status'] = 'ok';

    if($error[0] != '00000' && $error[0] != '')
    {
        
        $return['status'] = 'nok1';
        $return['code'] = $error[0];
        return;
    }

    $hiebid = $db->lastInsertId();

    /* staemme speichern */ 

   	$sql = 'INSERT INTO staemme (hiebid, position, baumart, laenge, durchmesser,staerkeklasse, kubatur, rindenabzug) VALUES ';

   	foreach ($_POST['staemme'] as $stamm => $details) 
   	{
   		$sql .= ' (:hiebid'.$stamm.', :position'.$stamm.', :baumart'.$stamm.', :laenge'.$stamm.', :durchmesser'.$stamm.', :staerkeklasse'.$stamm.', :volumen'.$stamm.', :rindenabzug'.$stamm.'),';
   	}

   	$sql = substr($sql, 0, -1);

	$stmt = $db->prepare($sql);   	

	foreach ($_POST['staemme'] as $stamm => $details) 
   	{
   		$stmt->bindParam(':hiebid'.$stamm, 			$hiebid, PDO::PARAM_INT);
		$stmt->bindParam(':position'.$stamm,		$details['position'], PDO::PARAM_INT);
		$stmt->bindParam(':baumart'.$stamm, 		$details['baumart'], PDO::PARAM_INT);
		$stmt->bindParam(':laenge'.$stamm, 			$details['laenge'], PDO::PARAM_STR);
		$stmt->bindParam(':durchmesser'.$stamm, 	$details['durchmesser'], PDO::PARAM_STR);
		$stmt->bindParam(':staerkeklasse'.$stamm, 	$details['staerkeKlasse'], PDO::PARAM_INT);
		$stmt->bindParam(':volumen'.$stamm, 		$details['volumen'], PDO::PARAM_STR);
		$stmt->bindParam(':rindenabzug'.$stamm, 	$details['rindenAbzug'], PDO::PARAM_INT);
   	}

	$stmt->execute();
	
	$error = $stmt->errorInfo();

    if($error[0] != '00000' && $error[0] != '')
    {
        
        $return['status'] = 'nok2';
        $return['code'] = $error[0];
        return;
    }

    echo json_encode($return);
}

if($_POST['action'] == 'showHiebList')
{

	$sql = "SELECT h.id, h.name,h.bestand, h.erfasser,DATE_FORMAT(datum, '%Y-%m-%dT%TZ') as datum from hieb h where h.erfasser = :erfasser order by h.datum DESC";

	$stmt = $db->prepare($sql);   	

	$stmt->bindParam(':erfasser',$erfasser, PDO::PARAM_INT);

	$stmt->execute();

	$out = array();

	$i = 0;

	while($temp = $stmt->fetch(PDO::FETCH_ASSOC))
	{
		$subselect = 'SELECT count(*) as stammAnz, sum(s.kubatur) as kubSum from staemme s where s.hiebid = :hiebid';

		$sub_stmt = $db->prepare($subselect);   	

		$sub_stmt->bindParam(':hiebid',$temp['id'], PDO::PARAM_INT);
		
		$sub_stmt->execute();

		$sub_temp = $sub_stmt->fetch(PDO::FETCH_ASSOC);

		$out[$i] = $temp;

		$out[$i]['kubSum'] = $sub_temp['kubSum'];

		$out[$i]['stammAnz'] = $sub_temp['stammAnz'];

		$i++;
	}
	
	echo json_encode($out);

}


if($_POST['action'] == 'showHiebDetails')
{
	$sql = "SELECT * from staemme WHERE hiebid = :hiebid";

	$stmt = $db->prepare($sql);   	

	$stmt->bindParam(':hiebid',$_POST['hiebid'], PDO::PARAM_INT);

	$stmt->execute();

	$out = $stmt->fetchAll(PDO::FETCH_ASSOC);

	echo json_encode($out);
}


if($_POST['action'] == 'hiebCount')
{
	$sql = 'SELECT count(*) as count from hieb where erfasser = :erfasser';

	$stmt = $db->prepare($sql);   	

	$stmt->bindParam(':erfasser', $erfasser,PDO::PARAM_INT);

	$stmt->execute();

	$out = $stmt->fetch(PDO::FETCH_ASSOC);
	
	echo json_encode($out);

}

?>