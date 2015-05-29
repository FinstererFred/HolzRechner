function Hieb(newH) 
{
    /* eigenschaften von hieb */
	    this.staemme = [];
 		this.valid = true;
 		this.name = '';
 		this.bestand = '';
 		this.datum = '';

	/* constructor, wird von tab staemme aufgerufen */	 		
 		if(newH)
 		{
 			this.init();
 		}

}

	Hieb.prototype = 
	{
	    init: function()
	    {
	    	this.name  = $('#inputName').val();
	    	this.bestand = $('#inputBestand').val();
	    	this.datum = $('#inputDatum').val();
	    },

	    addStamm: function(st) 
	    {
	        this.staemme.push(st);
	        
	        this.staemme[this.getStammCount()-1].position = this.getStammCount();
	        
	        this.writeStammCountToTab();
	    }, 

	    loescheStamm: function(st)
	    {
	    	;
	    },

	    speichern: function()
	    {
	    	;
	    }, 

	    isValid: function()
	    {
	    	this.valid = true;
	    	$('#layHieb div').removeClass('has-error');

	    	if(this.name.length == 0) 		{$('#grpName').addClass('has-error'); this.valid = false; } 
	    	if(this.bestand.length == 0) 	{$('#grpBestand').addClass('has-error'); this.valid = false; } 
	    	if(this.datum.length == 0) 		{$('#grpDatum').addClass('has-error'); this.valid = false; } 

	    	return this.valid;
	    }, 

	    getStammCount: function()
	    {
	    	return this.staemme.length;
	    }, 

	    getAbsoluteCount: function()
	    {
	    	var j = 0;

	    	for( var i in this.staemme)
	    	{
	    		if(typeof(this.staemme[i]) != 'undefined')
	    		{
	    			j++;
	    		}
	    	}

	    	return j;
	    }, 

	    sumKubatur: function()
	    {
	    	var j = 0;

	    	for( var i in this.staemme)
	    	{
	    		if(typeof(this.staemme[i]) != 'undefined')
	    		{
	    			j += this.staemme[i].volumen;
	    		}
	    	}

	    	return j;
	    },

		writeList: function()
		{
			$('.listEintrag').remove();

			for(var i in this.staemme)
			{
				var stamm = this.staemme[i];

				$('<tr class="listEintrag" data-stammnr="'+stamm.position+'"><td>'+stamm.position+'</td>'+'<td class="baum">'+baeume[stamm.baumart]['name']+'</td>'+'<td class="kub">'+ formatKub(stamm.volumen) +' fm</td><td class="del" data-target="#myModal" data-toggle="modal"><i class="fa fa-minus-square fa-2x"></i></td></tr>').insertAfter('#listeHead');
			}
		},

		writeListSum: function()
		{
			$('#kubSumme').html( formatKub( this.sumKubatur() ) );
		},

		writeStammCountToTab: function()
		{
			$('#stammCount').html( this.getAbsoluteCount() );
		},

		deleteStamm: function(stammnr)
		{
			delete( this.staemme[(stammnr-1)] );
		},

		checkboxSaveButton: function()
		{	
			if( this.getAbsoluteCount() > 0)
			{
				$('#saveNewHieb').removeAttr('disabled');
			}
			else
			{
				$('#saveNewHieb').attr('disabled', 'disabled');	
			}
		}, 

		changeValues: function(name, bestand, datum)
		{
			this.name = name;
			this.bestand = bestand;
			this.datum = datum;
		}

	}

function Stamm(durchmesser, laenge, baumart, rindenAbzug, showInButton) 
{
	this.durchmesser = durchmesser;
	this.laenge = laenge;
	this.baumart = baumart;
	this.rindenAbzug = rindenAbzug;
	this.rindenAbzugWert = 0;
	this.staerkeKlasse = 0;
	this.volumen = 0;
	this.showInButton = showInButton;

	this.init();
}

Stamm.prototype = 
{
    init: function ()
    {
    	this.findStaerkeKlasse(this.durchmesser);
    	
    	if(this.rindenAbzug)
    	{
    		this.findRindenAbzug(this.durchmesser);
    	}

    	this.berechnen();

    	if(this.showInButton)
    	{
    		this.writeToButton();
    	}
    },

    speichern: function()
    {
    	;
    },

    loeschen: function()
   	{
   		;
   	},

   	berechnen: function()
   	{
   		this.volumen = ((Math.PI/4 * Math.pow( (this.durchmesser-this.rindenAbzugWert), 2) ) * this.laenge ) / 10000;
	},

	writeToButton: function()
	{
		$('#volumenErgebnis').html( formatKub(this.volumen) );
	},

   	findStaerkeKlasse: function()
	{
		var durchmesser = this.durchmesser;

		for( var i in staerkeKlassen)
		{
			if( durchmesser >= staerkeKlassen[i]['von'] && durchmesser <= staerkeKlassen[i]['bis'] )
			{
				this.staerkeKlasse = i;
				return;
			}
		}
	},

	findRindenAbzug: function()
	{
		var abzug = baeume[this.baumart]['abzug'];
		var staerkeKlasse = this.staerkeKlasse;

		for( var i in rindenAbzug[abzug])
		{
			if( staerkeKlasse >= rindenAbzug[abzug][i]['von'] && staerkeKlasse <= rindenAbzug[abzug][i]['bis'] )
			{
				this.rindenAbzugWert = rindenAbzug[abzug][i]['abzug'];
				return;
			}
		}
	}

}