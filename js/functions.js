$(function ()
{

	$('#inputDatum').datepicker(
	{
	    format: "dd.mm.yyyy",
	    todayBtn: "linked",
	    language: "de",
	    todayHighlight: true,
	    orientation: "bottom auto",
	});

	/* Tabs */
		$('#newHiebTab').on('click', function()
		{
			$('.nav.nav-tabs li').removeClass('active');
			$(this).addClass('active');
			$('.row.marketing').hide();
			$('#hiebBody').show();
		});

		$('#archivTab').on('click', function()
		{
			archiv = new Archiv();
			
			$('.nav.nav-tabs li').removeClass('active');
			$(this).addClass('active');
			$('.row.marketing').hide();
			$('#archivBody').show();
			
			$('#archivList').show();
			$('#archivDetail').hide();
			
		});


		$('#navHieb').on('click', function()
		{
			$('#subNav button').removeClass('active');
			$(this).addClass('active');	
			$('.layer').hide();
			$('#layHieb').show();
		});

		$('#navStamm').on('click', function()
		{
			if(typeof(newHieb) == 'undefined')
			{
				newHieb = new Hieb(true);
			}
			else
			{
		    	var name = $('#inputName').val();
	    		var bestand = $('#inputBestand').val();
	    		var datum = $('#inputDatum').val();

				newHieb.changeValues(name, bestand, datum);
			}

			if( newHieb.isValid() )
			{
				$('#subNav button').removeClass('active');
				$(this).addClass('active');	
				$('.layer').hide();
				$('#layStaemme').show();
			}
		});

		$('#navListe').on('click', function()
		{
			if(typeof(newHieb) == 'undefined' || newHieb.getAbsoluteCount() == 0)
			{
				 return;
			}
			else
			{
				var name = $('#inputName').val();
	    		var bestand = $('#inputBestand').val();
	    		var datum = $('#inputDatum').val();

				newHieb.changeValues(name, bestand, datum);

				newHieb.writeList();
				newHieb.writeListSum();

				$('#subNav button').removeClass('active');
				$(this).addClass('active');	
				$('.layer').hide();
				$('#layListe').show();
			}
		});



	/* Buttons */
		/* taschenrechner knopf */
		$('#btnBerechnen').on('click', function() 
		{
			var _laenge = $('#inputLaenge').val();
			var _durchmesser = $('#inputDurchmesser').val();
			var _stammArt = $('#stammArt').val();
			var _stammRinde = $('#stammRinde').prop('checked');
			var _abschnitt = $('#stammAbschnitt').prop('checked');

			$('#layStaemme div').removeClass('has-error');

			if(_laenge == '' || _durchmesser == '' || _stammArt == -1)
			{
				if(_durchmesser == '') 
				{ 
					$('#inputDurchmesser').closest('.form-group').addClass('has-error');
					$('#inputDurchmesser').focus();
				}
				if(_laenge == '') 
				{ 
					$('#inputLaenge').closest('.form-group').addClass('has-error');
					$('#inputLaenge').focus();
				}

				if(_stammArt == -1) 
				{
					$('#stammArt').closest('.form-group').addClass('has-error');
					$('#stammArt').focus();	
				}

				return;
			}
			else
			{
				newHieb.addStamm( new Stamm( _durchmesser,_laenge,_stammArt, true ) );
				newHieb.checkboxSaveButton();
			}

			if(!_abschnitt)
			{
				$('#inputLaenge').val('');
				$('#inputLaenge').focus();
			}
			else
			{
				$('#inputDurchmesser').focus();
			}

			$('#inputDurchmesser').val('');
			
		});

		/* delete stamm */
		$('#layListe').on('click', '.del', function() 
		{
			var stammNr = $(this).parent().data('stammnr');
			$('#modalStammNr').html(stammNr);
			$('#delLog').data('stammnr', stammNr);
		});

		$('#delLog').on('click', function() 
		{
			$('#myModal').modal('hide');
			var stammNr = $(this).data('stammnr');

			newHieb.deleteStamm(stammNr);
			newHieb.writeStammCountToTab();
			newHieb.writeListSum();
			newHieb.writeList();
			newHieb.checkboxSaveButton();
		});

		$('#saveNewHieb').on('click', function()
		{
			newHieb.speichern();
			
			/* d1 ist globales deferred object das in newHieb.speichern resolved wird */
			$.when( d1 ).done(function ( ret ) 
			{
				if(ret.status == 'ok')
				{
					getHiebCount();

					delete( newHieb );
					d1 = $.Deferred();

					$('#stammCount').html('0');
					$('#subNav button').removeClass('active');
					$('#navHieb').addClass('active');	
					$('.layer').hide();
					$('#layHieb').show();
					$('#inputName').val('');
					$('#inputBestand').val('');

				}
			});
		});

		$('#hiebList').on('click', 'tr.archivEntry', function ()
		{
			var kopfdaten = getHiebKopfdaten(this);

			$('#archivList').hide();
			archiv.writeList( $(this).data('hiebid') );
			
			$('#detailName').html(kopfdaten.name);
			$('#detailBestand').html(kopfdaten.bestand);
			$('#detailDatum').html(kopfdaten.datum);


			getHiebSum( $(this).data('hiebid') );
			//

			$('#detailAnzahl').html(kopfdaten.anzahl+" x");
			$('#detailKubaturMit').html(kopfdaten.kubatur_mit);
			$('#detailKubaturOhne').html(kopfdaten.kubatur_ohne);
			
			
			$('#archivDetail').show();
		});

		$('#showHiebList').on('click', function()
		{
			$('#archivList').show();
			$('#archivDetail').hide();
		});

	/* input felder */
		$('#inputDurchmesser').on('keyup', function(event)
		{
			var input = $(this).val();
						
			if($.isNumeric(input))
			{
				$('#volumenErgebnis').html('0.00');

				if(event.keyCode == 13)
				{
					$('#btnBerechnen').click();
				}
			}
			else
			{
				$(this).val('');
			}

		});

		$('#inputLaenge').on('keyup', function(event)
		{
			var input = $(this).val();
			
			if($.isNumeric(input))
			{
			
				$('#volumenErgebnis').html('0.00')

				if(event.keyCode == 13)
				{
					$('#inputDurchmesser').focus();	
				}
			}
			else
			{
				$(this).val('');
			}
		});

		$('#stammAbschnitt').on('change', function() 
		{
			if($(this).prop('checked') == false)
			{
				$('#inputLaenge').val('');
				
				$('#inputLaenge').focus();
			}
			else
			{
				$('#inputLaenge').focus();	
			}
		});


});


function datum()
{
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;
	var yyyy = today.getFullYear();

	if(dd<10) 
	{
	    dd='0'+dd
	} 

	if(mm<10) 
	{
	    mm='0'+mm
	} 

	return  dd+'.'+mm+'.'+yyyy;
}

function formatKub(kub, type)
{
	/* erg auf 2 stellen nach dem komma abrunden */
	if(type == 'round') {
		return (Math.floor((kub * 100 )) / 100).toFixed(2);	
	} else {
		return Math.floor((kub * 100 )) / 100;	
	}
	
	
}

function getHiebSum(hiebid)
{
	$.ajax({
		method: "POST",
		url: 'php/ajax.php',
		data: { action : 'hiebSum', hiebid: hiebid},
		dataType : 'json'	
	})
	.done( function(resp)
	{
		$('.baumartSum').remove();
		$(resp).each(function(key,value) {

			$('<tr class="baumartSum"> <td colspan="" align="right">'+value.anzahl+' x</td><td>'+baeume[value.baumart].name+'</td> <td></td> <td></td> <td></td>  <td align="right">'+value.mit+' fm</td> <td align="right">'+value.ohne+' fm</td></tr>').insertAfter('#zwischensumme');
		});
	});	
}

function getHiebCount()
{
	$.ajax({
		method: "POST",
		url: 'php/ajax.php',
		data: { action : 'hiebCount'},
		dataType : 'json'	
	})
	.done( function(resp)
	{
		if( $.isNumeric( resp.count ) )
		{
			$('#hiebCount').html(resp.count);
		}
		
	});
}

function getHiebKopfdaten(hieb)
{

	var out = {};
	out.name =    $(hieb).find('td:nth-child(2)').html();
	out.bestand = $(hieb).find('td:nth-child(3)').html();
	out.datum =   $(hieb).find('td:nth-child(1)').html();
	out.kubatur_mit =  $(hieb).find('td:nth-child(5)').html();
	out.kubatur_ohne = $(hieb).find('td:last').html();
	out.anzahl = $(hieb).find('td:nth-child(4)').html();	

	return out;
}

function formatDate(date)
{
	function pad(n){return n<10 ? '0'+n : n}
	
	var _date = new Date(date);
	var day = _date.getDate();
    var monthIndex = _date.getMonth()+1;
    var year = _date.getFullYear();

    return pad(day)+'.'+pad(monthIndex)+'.'+year;
}