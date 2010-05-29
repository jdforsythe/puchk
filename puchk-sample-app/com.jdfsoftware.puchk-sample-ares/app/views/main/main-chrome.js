opus.Gizmo({
	name: "main",
	dropTarget: true,
	type: "Palm.Mojo.Panel",
	h: "100%",
	styles: {
		zIndex: 2,
		bgImage: "images/update.png",
		opacity: 1
	},
	chrome: [
		{
			name: "header1",
			label: "puchk Ares",
			type: "Palm.Mojo.Header",
			l: 0,
			t: 0
		},
		{
			name: "html1",
			content: "This is an example of using puchk in Ares.\n  \nYour app is running and will only be interrupted if the appropriate interval has passed and there is an update.\n",
			type: "Palm.Mojo.Html",
			l: 0,
			t: 0,
			h: "100%",
			styles: {
				opacity: 1
			}
		}
	]
});