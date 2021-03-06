/*
 * AC Fry - JavaScript Framework v1.0
 *
 * ac.stub.BOCombo
 *
 * (c)2006 Petr Krontorad, April-Child.com
 * Portions of code based on WHOA Bender Framework, (c)2002-2005 Petr Krontorad, WHOA Group.
 * http://www.april-child.com. All rights reserved.
 * See the license/license.txt for additional details regarding the license.
 * Special thanks to Matt Groening and David X. Cohen for all the robots.
 */



// [1] since we are using a stub, we should define our own widget based on it, let's call it Lister


/*  ---------------------------------------------------------------- 
	Lister < ac.stub.BOCombo
*/
$class('Lister < ac.stub.BOCombo');

Lister.prototype.preInitChildWidgets = function()
{
	// this is the place, where we can add more widgets to our combo.
	// we leave it empty for now..
}

// following methods we usually override

Lister.prototype.getComboParentWidget = function()
{
	// returns parent widget holding the combo, if your combo is nested, you can override default parent and alter focus and keyboard behavior
	return null;
}

// now, let's define method for actual switching of views, this should be always controlled by us
Lister.prototype.switchTo = function(mode, skipToggle)
{
	mode = mode || this.viewMode;
	var switch_to_browser = skipToggle ? 0 == this.viewMode : 1 == this.viewMode;
	if ( null == this.browser.model.rootElement )
	{
		this.browser.model.rootElement = this.model.rootElement;		
	}
	if ( switch_to_browser )
	{
		this.outlineview.setVisibility(false);
		this.showBrowser();
		var selection = this.outlineview.getSelection();
		if ( 0 != selection.length )
		{
			this.browser.showFrom(selection[0], true, true);
		}
		this.browser.setVisibility(true);
		ac.widget.focus(this.browser);
	}
	else
	{
		this.browser.setVisibility(false);
		this.showOutlineView()
		var selection = this.browser.getSelection();
		if ( 0 != selection.length )
		{
			this.outlineview.showFrom(selection[0]);
		}
		this.outlineview.setVisibility(true);
		ac.widget.focus(this.outlineview);
	}
	if ( !skipToggle )
	{
		this.viewMode = ++this.viewMode & 1;
	}
}

// this is the place where we positionate our combo inside our layout
Lister.prototype.render = function()
{
	var width = this.containerNode.w();
	var height = this.containerNode.h();
	this.renderingNode = this.containerNode.a($$()).pos(true).x(0).y(0).w(width).h(height);
	
	// creating toolbar node - will be used for displaying switch buttons
	this.toolBarNode = this.renderingNode.a($$()).pos(true).x(0).y(0).w(width-6).h(28).s('background:#ddd;padding:3px;border-bottom:1px solid #888');
	// let's add the switch buttons
	var caller = this;
	this.toolBarNode.a($$()).t('<img src="mm/i/theme/apple/combo-switch-bo-browser.gif" />').e('click', function(evt)
	{
		evt.stop();
		var was_browser = true;
		if ( -1 != evt.$.ga('src').indexOf('browser') )
		{
			// was browser, will switch to outlineview
			caller.switchTo(1);
		}
		else
		{
			// was outlineview, will switch to browser
			caller.switchTo(0);
			was_browser = false;
		}
		// changing the image
		evt.$.sa('src', 'mm/i/theme/apple/combo-switch-bo-?.gif'.embed(was_browser?'outlineview':'browser'));
	});
	// adding combo showing actual folder/path
	this.toolBarNode.a($$()).pos(true).x(100).y(3).w(200);
	this.comboBoxNode = this.toolBarNode.lc().a($$('select')).w(200).e('change', function(evt)
	{
		var elem = caller.browser.model.getElementById($comboget(caller.comboBoxNode));
		if ( null != elem )
		{
			caller.showFrom(elem);
		}
	});
	
	// creating `comboPaneNode` - the name of the property must be exactly this - it is used internally to display views
	this.comboPaneNode = this.renderingNode.a($$()).pos(true).x(0).y(35).w(width).h(height-35);
	// let's switch to default view - it will take care of the rest of rendering
	this.switchTo(false, true);
}


// Now it's the time to define typical MVC classes, let's start with a model


// [2] we define our own model extending default class `ac.stub.BOComboModel`

/*  ---------------------------------------------------------------- 
	ListerModel < ac.stub.BOComboModel
*/

$class('ListerModel < ac.stub.BOComboModel');


// we need to override the `loadElements` method of the original class, this is where our own data need to be acquired
ListerModel.prototype.loadElements = function(acElem, callbackOnSuccess, callbackOnError)
{
	// let's create some fake data, normally this would be the place where you call remote server for real data
	var alphabet = 'AFGHI.odvB.xmlCFry DQ.pngPNVMDIaskJavaScriptdrepo OWP.SDFrameworkEJQRSTU v.1.0VW3Jana199803NO XYTomulinaKLMP343l kfjdKrontosaorp.eweri Z012589absc.gif ADd eBiofghijkl.mst uvwxnopq.html';
	
	// pretend, that in some minor cases, data could not been retrieved
	if ( 0.2 > Math.random() )
	{
		callbackOnError('Could not load elements. Random error code would be '+Math.random());
		return;
	}
	
	// let's simulate some pause usually caused by trip to server
	$runafter( Math.floor(1000*Math.random()), function()
	{
		var num_elements = 2 + Math.floor( 30*Math.random() );
		for ( var i=0; i<num_elements; i++ )
		{
			// appending new child object
			var child_elem = acElem.appendChild($new(ACElement));
			// randomly define whether the object is a collection
			child_elem.isCollection = 0.2 > Math.random();
			if ( child_elem.isCollection )
			{
				// if so, set the state as `STATE_WILL_LOAD` so that when expanded, new trip to this method is performed (recursion)
				child_elem.setState(child_elem.STATE_WILL_LOAD);
			}
		
			// creating random label
			child_elem.properties.label = alphabet.substr(Math.floor(Math.random()*(alphabet.length-12)), 2+Math.floor(Math.random()*10));
			// creating size information
			child_elem.properties.size = child_elem.isCollection ? 0 : Math.floor(50000*Math.random());
			// creating dateCreated information
			child_elem.properties.date_created = fry.calendar.util.getUnixTimestamp() - (-100000 + Math.floor(2000000*Math.random()));
			// creating version information
			child_elem.properties.version = 1+Math.floor(20*Math.random());
			
			
		}
		// we have finished appending new child objects, let's commit the operation using `callbackOnSuccess` callback.
		callbackOnSuccess();
	});
}

// [3] we define our own controller extending default class `ac.stub.BOComboController`

/*  ---------------------------------------------------------------- 
	ListerController < ac.stub.BOComboController
*/

$class('ListerController < ac.stub.BOComboController');

ListerController.prototype.onSelectionChanged = function(selection)
{
	// updating our combo box showing the actual folder/path
	var elem = this.widget.getLastSelection();
	if ( null == elem )
	{
		elem = this.widget.browser.model.rootElement;
	}
	if ( !elem.isCollection )
	{
		elem = elem.parentElement;
	}
	$combofill(this.widget.comboBoxNode.t(''), function()
	{
		if ( null == elem )
		{
			return false;
		}
		var option = [elem.id, elem.properties.label];
		elem = elem.parentElement;
		return option;
	});
}

ListerController.prototype.onGetElementValueForEditing = function(acElem, colId)
{
	return acElem.properties.label;
}

ListerController.prototype.onElementRename = function(acElem, label, callbackOk, callbackError)
{
	// this is the place to call for remote operation causing actual rename
	var was_canceled = false;
	// we call the helper function to display alert window
	var win = alertUser('Renaming...', 'Renaming ? to ?<br/>Please wait.'.embed(acElem.properties.label, label), function()
	{
		// canceled
		was_canceled = true;
	});
	// let's simulate remote operation ($rpost( ... ))
	// now sleep for a while, this is where you operation is running and waiting for response
	$runafter(2000, function()
	{
		if ( !was_canceled )
		{
			win.close();
			acElem.properties.label = label;
			callbackOk();
		}
		else
		{
			callbackError();
		}
		ac.widget.focus(this.widget);
	});	
}

ListerController.prototype.onElementMoveCopy = function(acElemLst, targetElement, isMove, callbackOk)
{
	var was_canceled = false;
	var labels = [];
	// let's get list of all labels to be displayed in alert window
	$foreach ( acElemLst, function(acElem)
	{
		labels.push(acElem.properties.label);
	});
	// we call the helper function to display alert window
	var win = alertUser('?ing...'.embed(isMove?'Mov':'Copy'), '?ing ? item(s) (?) to ?<br/>Please wait.'.embed(isMove?'Mov':'Copy', labels.length, labels.join(', '), targetElement.properties.label), function()
	{
		// canceled
		was_canceled = true;
	});
	// let's simulate remote operation ($rpost( ... ))
	// now sleep for a while, this is where you operation is running and waiting for response
	$runafter(2000, function()
	{
		if ( !was_canceled )
		{
			win.close();
			callbackOk();			
		}
		ac.widget.focus(this.widget);
	})	
}

ListerController.prototype.onAfterShowFrom = function(acElem)
{
	// this method is invoked after view is switched and all elements in the new view are rendered
}

ListerController.prototype.onAfterRenderElement = function(acElem)
{
	// this method is invoked after column (browser) or children's list (outlineview) has been rendered
}


// [4] we define our own view extending default class `ac.stub.BOComboView`
// view actually affects final rendering of the widget (data of our model)

/*  ---------------------------------------------------------------- 
	ListerView < ac.stub.BOComboView
*/

$class('ListerView < ac.stub.BOComboView');



ListerView.prototype.renderElementInRow = function(acElem, rowData)
{
	with ( acElem.properties )
	{
		rowData['label'] = label;
		rowData['date_created'] = fry.calendar.format.dateTime(date_created, client.conf.locale);
		rowData['size'] = size;
		rowData['version'] = version;
	}
}

ListerView.prototype.renderElementDetail = function(acElem, node)
{
	// using fry snippet to render table with two columns - key/value pairs
	fry.ui.snippet.TablePairedInfo(node, acElem.properties.label, ['size', 'version', 'date_created'], function(key)
	{
		var v = acElem.properties[key];
		if ( 'date_created' == key )
		{
			v = fry.calendar.format.dateTime(v, client.conf.locale);
		}
		return [$loc('lU_?'.embed(key)), v];
	});
}

ListerView.prototype.renderElementOutlineviewDetail = function(acElem, node)
{
	this.renderElementDetail(acElem, node);
}



// To fully accomplish our task, let's define helper function for alerting when performing elements operations

// [5] let's define a helper function for showing elements operation alerts - used to inform user of copying and such..
function alertUser(title, msg, callbackOnClose)
{
	// let's define window view if not previously defined
	if ( 'undefined' == typeof View )
	{
		$class('View < ac.WindowWidgetView');
	}
	View.prototype.onRenderTitle = function(node, params)
	{
		node.t(title);
	}
	View.prototype.onRenderContent = function(node, params)
	{
		var caller = this;
		node.a($$()).s('padding:8px;').t('?<br/><br/>'.embed(msg)).a($crec('Cancel', function()
		{
			caller.widget.close();
		}));
	}		
	// let's define window controller if not previously defined
	if ( 'undefined' == typeof Controller )
	{
		$class('Controller < ac.WindowWidgetController');
	}
	Controller.prototype.onClose = function()
	{
		callbackOnClose();
		return true;
	}		
	var win = $new
	(
		ac.WindowWidget,
		$new(ac.WindowWidgetModel),
		$new(View, {isModal:true, hasStatus:false, hasCloseButton:false, defaultSize:{width:340,height:100}}),
		$new(Controller)
	);
	// we defined .acw-window-modal-bg.alert CSS class in test.ac.browser.css to overide default modal surround
	win.show(null, 'alert');
	ac.widget.focus(win);
	return win;
}




// each dynamically loaded script must end with the following statements
if ( 'undefined' != typeof fry && 'undefined' != typeof fry.script )
{
	fry.script.register();
}