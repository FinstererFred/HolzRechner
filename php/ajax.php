<?php

include('db.class.php');

/**/
$benutzer = "%".$_SERVER['REMOTE_USER']."%";
$sql = 'SELECT * from benutzer b where b.kurz like :usernr';
$stmt = $db->prepare($sql);
$stmt->bindParam('usernr',$benutzer,PDO::PARAM_STR);
$stmt->execute();
$result = $stmt->fetch(PDO::FETCH_ASSOC);
$benutzer = $result['id'];


$erfasser = $benutzer;


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

   	$sql = 'INSERT INTO staemme (hiebid, position, baumart, laenge, durchmesser,staerkeklasse, kubatur_mit, kubatur_ohne) VALUES ';

   	foreach ($_POST['staemme'] as $stamm => $details) 
   	{
   		$sql .= ' (:hiebid'.$stamm.', :position'.$stamm.', :baumart'.$stamm.', :laenge'.$stamm.', :durchmesser'.$stamm.', :staerkeklasse'.$stamm.', :kubatur_mit'.$stamm.', :kubatur_ohne'.$stamm.'),';
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
		$stmt->bindParam(':kubatur_mit'.$stamm, 	$details['volumen'], PDO::PARAM_STR);
		$stmt->bindParam(':kubatur_ohne'.$stamm, 	$details['volumenOhne'], PDO::PARAM_STR);
		
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

	$sql = "SELECT h.id, h.name,h.bestand, h.erfasser,DATE_FORMAT(datum, '%Y-%m-%dT%TZ') as datum from hieb h where h.erfasser = :erfasser order by h.datum DESC, h.id DESC";

	$stmt = $db->prepare($sql);   	

	$stmt->bindParam(':erfasser',$erfasser, PDO::PARAM_INT);

	$stmt->execute();

	$out = array();

	$i = 0;

	while($temp = $stmt->fetch(PDO::FETCH_ASSOC))
	{
		$subselect = 'SELECT count(*) as stammAnz, sum(s.kubatur_mit) as kubSumMit, sum(s.kubatur_ohne) as kubSumOhne from staemme s where s.hiebid = :hiebid';

		$sub_stmt = $db->prepare($subselect);   	

		$sub_stmt->bindParam(':hiebid',$temp['id'], PDO::PARAM_INT);
		
		$sub_stmt->execute();

		$sub_temp = $sub_stmt->fetch(PDO::FETCH_ASSOC);

		$out[$i] = $temp;

		$out[$i]['kubSumMit'] = $sub_temp['kubSumMit'];
		$out[$i]['kubSumOhne'] = $sub_temp['kubSumOhne'];

		$out[$i]['stammAnz'] = $sub_temp['stammAnz'];

		$i++;
	}
	
	echo json_encode($out);

}


if($_POST['action'] == 'showHiebDetails')
{
	$sql = "SELECT * from staemme WHERE hiebid = :hiebid order by id ASC";

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

if($_POST['action'] == 'hiebSum')
{
	$hiebid = $_POST['hiebid'];

	$sql = 'SELECT baumart, sum(kubatur_mit) as mit, sum(kubatur_ohne) as ohne from staemme where hiebID = :hiebid group by baumart';

	$stmt = $db->prepare($sql);   	

	$stmt->bindParam(':hiebid', $hiebid,PDO::PARAM_INT);

	$stmt->execute();


	$out = $stmt->fetchAll(PDO::FETCH_ASSOC);
	
	echo json_encode($out);

}



?>