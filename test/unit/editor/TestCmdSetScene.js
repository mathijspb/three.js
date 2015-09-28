module("TestCmdSetScene");

test("Test for CmdSetScene (Undo and Redo)", function() {

	// setup
	var editor = new Editor();
	objects = [ aBox(), aSphere(), aPointlight() ];


	// create multiple editors (scenes) and save the output
	var scenes = objects.map( function( object ) {

		editor = new Editor();
		var cmd = new CmdAddObject( object );
		cmd.updatable = false;
		editor.execute( cmd );
		return { obj: object, exportedData: exportScene( editor ) };

	});


	// create new empty editor (scene), merge the other editors (scenes)
	editor = new Editor();
	scenes.map( function( scene ) {

		var importedScene = importScene( scene.exportedData );
		var cmd = new CmdSetScene( editor.scene, importedScene );
		cmd.updatable = false;
		editor.execute( cmd );

	});

	// tests
	ok( editor.scene.children.length = scenes.length,
		"OK, all scenes have been merged");

	var i = 0;
	while( i < editor.scene.children.length ) {

		ok( editor.scene.children[ i ].name == scenes[ i ].obj.name,
			"OK, editor.scene.children[ " + i + " ].name matches scenes[ " + i + " ].obj.name");
		i++;

	}

	editor.undo();
	var i = 0;
	while( i < editor.scene.children.length ) {

		ok( editor.scene.children[ i ].name == scenes[ i ].obj.name,
			"OK, editor.scene.children[ " + i + " ].name matches scenes[ " + i + " ].obj.name after undo");
		i++;

	}


	editor.redo();
	var i = 0;
	while( i < editor.scene.children.length ) {

		ok( editor.scene.children[ i ].name == scenes[ i ].obj.name,
			"OK, editor.scene.children[ " + i + " ].name matches scenes[ " + i + " ].obj.name after redo");
		i++;

	}


});