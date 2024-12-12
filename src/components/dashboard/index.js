const { Component, useState, useEffect } = wp.element;
import apiFetch from '@wordpress/api-fetch';

import {
	Icon,
	styles,
	close,
	plus,
	key,
	check,
	typography,
	textColor,
	lockSmall,
	category,
	columns,
	atSymbol,
	settings,
	upload,
	color,
	plusCircle,
	download,
	arrowRight,
	brush,
	code,
} from "@wordpress/icons";


import PGtabs from "../../components/tabs";
import PGtab from "../../components/tab";
import WCPSList from "../../components/wcps-list";
import AccordionsView from "../../components/accordions-view";
import AccordionsEdit from "../../components/accordions-edit";



function Html(props) {
	if (!props.warn) {
		return null;
	}



	var defaultPostData = {
		sliderFor: "products",

		"wrapper": {


			"options": {
				"content": "",
				"tag": "div",
				"class": "pg-accordion-nested"
			},
			"styles": {}

		},

		"content": {


			"options": {
				"tag": "div",
				"class": "accordion-content",
				"overrideChild": true
			},
			"styles": {}

		},
		"header": {


			"options": {
				"tag": "div",
				"class": "accordion-header",
				"overrideChild": true
			},
			"styles": {}

		},
		"headerActive": {


			"options": {
				"tag": "div",
				"class": "accordion-header-active"
			},
			"styles": {}

		},
		"headerLabel": {


			"options": {
				"text": "Accordion Header",
				"tag": "div",
				"class": "accordion-header-label",
				"overrideChild": true
			},
			"styles": {}

		},
		"labelCounter": {


			"options": {
				"enable": false,
				"position": "",
				"tag": "div",
				"class": "accordion-label-counter",
				"overrideChild": true
			},
			"styles": {}

		},
		"labelIcon": {


			"options": {
				"library": "fontAwesome",
				"srcType": "class",
				"iconSrc": "",
				"position": "",
				"class": "accordion-label-icon",
				"overrideChild": true
			},
			"styles": {}

		},
		"icon": {


			"options": {
				"library": "fontAwesome",
				"srcType": "class",
				"iconSrc": "fas fa-angle-down",
				"position": "left",
				"class": "accordion-icon",
				"overrideChild": true
			},
			"styles": {}

		},
		"iconToggle": {


			"options": {
				"library": "fontAwesome",
				"srcType": "class",
				"iconSrc": " fas fa-angle-up",
				"class": "accordion-icon-toggle"
			},
			"styles": {}

		},
		"accOptions": {


			"active": "9999",
			"collapsible": true,
			"heightStyle": "content"

		},
	};

	var [activeAccordion, setActiveAccordion] = useState(null); // Using the hook.
	console.log(activeAccordion);
	var [postData, setpostData] = useState(defaultPostData); // Using the hook.
	var [isLoading, setisLoading] = useState(false); // Using the hook.


	function selectAccordion(args) {

		setActiveAccordion(args)
	}


	function onChangeAccordion(args) {

		setpostData(args)
		//setaccordionData(args)
	}




	useEffect(() => {

		setisLoading(true);


		apiFetch({
			path: "/accordions/v2/accordions_data",
			method: "POST",
			data: {
				postId: activeAccordion,
				_wpnonce: post_grid_editor_js._wpnonce,

			},
		}).then((res) => {

			setisLoading(false);


			if (res?.post_content?.length == 0) {
				res.post_content = defaultPostData;
			}

			setpostData(res);

		});






	}, [activeAccordion]);







	// ! hello
	return (
		<div className="pg-setting-input-text pg-dashboard">

			<div className="flex ">

				<div className="w-[450px] overflow-y-scroll light-scrollbar">
					<PGtabs
						activeTab="accordions"
						orientation=""
						contentClass=" bg-white w-full"
						navItemClass="bg-gray-200 px-5 py-3 gap-2"
						navItemSelectedClass="!bg-white"
						activeClass="active-tab"
						onSelect={(tabName) => { }}
						tabs={[
							{
								name: "accordions",
								title: "accordions",
								icon: columns,
								className: "tab-disable-blocks",
							},
							{
								name: "edit",
								title: "Edit",
								icon: brush,
								className: "tab-disable-blocks",
							},
							{
								name: "templates",
								title: "Templates",
								icon: category,
								className: "tab-disable-blocks",
							},


						]}>
						<PGtab name="accordions">
							<div className="relative p-3">

								<p>Please select accordions first.</p>
								<WCPSList selectAccordion={selectAccordion} activeAccordion={activeAccordion} />
							</div>
						</PGtab>
						<PGtab name="edit">
							<div className=" ">
								<AccordionsEdit onChange={onChangeAccordion} postData={postData} />
							</div>
						</PGtab>
						<PGtab name="templates">
							<div className="p-3">
								Coming Soon
							</div>
						</PGtab>











					</PGtabs>

				</div>
				<div className="w-full sticky top-0">
					<div className="  relative">


						<AccordionsView isLoading={isLoading} postData={postData} id={activeAccordion} />
					</div>

				</div>
			</div>




		</div>
	);
}

class PGDashboard extends Component {
	constructor(props) {
		super(props);
		this.state = { showWarning: true };
		this.handleToggleClick = this.handleToggleClick.bind(this);
	}

	handleToggleClick() {
		this.setState((state) => ({
			showWarning: !state.showWarning,
		}));
	}

	render() {
		var { onChange, setEnable } = this.props;

		return <Html setEnable={setEnable} warn={this.state.showWarning} />;
	}
}

export default PGDashboard;