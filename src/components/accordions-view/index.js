const { Component, RawHTML, useState, useEffect } = wp.element;
import apiFetch from "@wordpress/api-fetch";
import { Popover, Spinner } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { Icon, close, cog } from "@wordpress/icons";

import { Fragment } from "react";
import PGinputSelect from "../input-select";
import PGinputText from "../input-text";

var myStore = wp.data.select("postgrid-shop");

function Html(props) {
	if (!props.warn) {
		return null;
	}

	var id = props.id;
	var onChange = props.onChange;
	var addNotifications = props.addNotifications;

	var isLoading = props.isLoading;
	var onUpdate = props.onUpdate;
	var pleaseUpdate = props.pleaseUpdate;

	var postDataX = props.postData;
	var accordionDataX = postDataX.post_content;

	if (accordionDataX == null) {
		return null;
	}

	var [pleaseUpdateX, setpleaseUpdateX] = useState(props.pleaseUpdate); // Using the hook.
	var [postData, setpostData] = useState(props.postData); // Using the hook.
	var [accordionData, setaccordionData] = useState(postData.post_content); // Using the hook.

	var [styleObj, setstyleObj] = useState({}); // Using the hook.

	var [wrapper, setwrapper] = useState(accordionDataX.wrapper); // Using the hook.
	var [items, setitems] = useState(accordionDataX.items); // Using the hook.
	var [content, setcontent] = useState(accordionDataX.content);
	var [accOptions, setaccOptions] = useState(accordionDataX.accOptions);
	var [header, setheader] = useState(accordionDataX.header);
	var [headerActive, setheaderActive] = useState(accordionDataX.headerActive);
	var [headerLabel, setheaderLabel] = useState(accordionDataX.headerLabel);
	var [labelCounter, setlabelCounter] = useState(accordionDataX.labelCounter);
	var [labelIcon, setlabelIcon] = useState(accordionDataX.labelIcon);
	var [icon, seticon] = useState(accordionDataX.icon);
	var [iconToggle, seticonToggle] = useState(accordionDataX.iconToggle);

	var [AIWriter, setAIWriter] = useState(false); // Using the hook.

	const [toggled, setToggled] = useState(false);
	const [labelIconHtml, setlabelIconHtml] = useState("");

	const [iconHtml, seticonHtml] = useState("");
	const [iconToggleHtml, seticonToggleHtml] = useState("");

	const [optionData, setoptionData] = useState({});
	const [optionDataSaved, setoptionDataSaved] = useState({});
	const [isLoadings, setisLoadings] = useState(false);

	const [roles, setroles] = useState([]);

	useEffect(() => {
		setisLoadings(true);
		apiFetch({
			path: "/user-verification/v2/get_options",
			method: "POST",
			data: { option: "user_verification_settings" },
		}).then((res) => {
			if (res.length != 0) {
				var resX = { ...res };

				setoptionDataSaved(resX);
				setoptionData(resX);
			}
			setisLoadings(false);
		});
	}, []);

	useEffect(() => {
		apiFetch({
			path: "/user-verification/v2/user_roles_list",
			method: "POST",
			data: {},
		}).then((res) => {
			var rolesX = [];
			Object.entries(res).map((role) => {
				var index = role[0];
				var val = role[1];
				rolesX.push({ label: val, value: index });
			});
			setroles(rolesX);
		});
	}, []);

	console.log(optionData);

	const copyData = (data) => {
		navigator.clipboard
			.writeText(data)
			.then(() => {
				addNotifications({
					title: "Copied to clipboard!",
					content:
						"Use the shortcode in page or post conent where you want to display.",
					type: "success",
				});
			})
			.catch((err) => {});
	};

	useEffect(() => {
		setpostData(props.postData);
	}, [props.postData]);

	useEffect(() => {
		setaccordionData(postData.post_content);
		setitems(postData.post_content.items);
	}, [postData]);

	useEffect(() => {
		var accordionDataX = { ...accordionData };
		accordionDataX.items = items;
		onChange(accordionDataX);
	}, [items]);

	useEffect(() => {
		setpleaseUpdateX(pleaseUpdate);
	}, [pleaseUpdate]);

	useEffect(() => {
		var iconSrc = iconToggle?.options?.iconSrc;
		var iconHtml = `<span class="${iconSrc}"></span>`;
		seticonToggleHtml(iconHtml);
	}, [iconToggle?.options]);

	useEffect(() => {
		var iconSrc = icon?.options?.iconSrc;
		var iconHtml = `<span class="${iconSrc}"></span>`;
		seticonHtml(iconHtml);
	}, [icon?.options]);

	useEffect(() => {
		var iconSrc = labelIcon?.options?.iconSrc;
		var iconHtml = `<span class="${iconSrc}"></span>`;
		setlabelIconHtml(iconHtml);
	}, [labelIcon?.options]);

	var [active, setactive] = useState(9999);

	return (
		<div className="ml-5">
			<div className="flex items-center justify-between align-middle bg-white p-5  mb-5">
				<div className="flex items-center gap-5">
					<h2>
						{postData?.post_title && (
							<>You are editing: {postData.post_title}</>
						)}
					</h2>
				</div>

				<div className="flex items-center align-middle gap-3">
					<div className=" tracking-wide ">
						<div
							className="py-1 px-2 cursor-pointer  capitalize bg-gray-700 text-white font-medium rounded hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
							onClick={(ev) => {
								ev.preventDefault();
								ev.stopPropagation();
								setAIWriter(!AIWriter);
							}}>
							{" "}
							<Icon fill={"#fff"} icon={cog} />
						</div>
						{AIWriter && (
							<Popover position="bottom right">
								<div className="w-[600px] p-3 relative">
									<span
										className="cursor-pointer px-1 bg-red-500 hover:bg-red-700 hover:text-white absolute top-0 right-0"
										onClick={(ev) => {
											ev.preventDefault();
											ev.stopPropagation();
											setAIWriter(!AIWriter);
										}}>
										<Icon fill={"#fff"} icon={close} />
									</span>

									<div>
										<div className="flex  my-5  justify-between items-center">
											<label className="w-[400px]" htmlFor="">
												{__("Allow access by roles", "accordions")}
											</label>
											<PGinputSelect
												val={optionData?.user_roles ?? []}
												className="!py-1 px-2 max-w-[200px] w-[180px]"
												options={roles}
												onChange={(newVal) => {
													var optionsX = {
														...optionData,
														user_roles: newVal,
													};
													setoptionData(optionsX);
												}}
												multiple={true}
											/>
										</div>
										<div className="flex  my-5  justify-between items-center">
											<label className="w-[400px]" htmlFor="">
												{__("Font-awesome version", "accordions")}
											</label>
											<PGinputSelect
												val={optionData?.font_aw_version ?? "none"}
												className="!py-1 px-2 max-w-[200px] w-[180px]"
												options={[
													{ label: "None", value: "none" },
													{ label: "Version 4+", value: "v_4" },
													{ label: "Version 5+", value: "v_5" },
												]}
												onChange={(newVal) => {
													var optionsX = {
														...optionData,
														font_aw_version: newVal,
													};
													setoptionData(optionsX);
												}}
												multiple={false}
											/>
										</div>
										<div className="flex  my-5  justify-between items-center">
											<label className="w-[400px]" htmlFor="">
												{__("Allow Iframe on accordion", "accordions")}
											</label>
											<PGinputSelect
												val={optionData?.allow_iframe ?? "no"}
												className="!py-1 px-2 max-w-[200px] w-[180px]"
												options={[
													{ label: "No", value: "no" },
													{ label: "Yes", value: "yes" },
												]}
												onChange={(newVal) => {
													var optionsX = {
														...optionData,
														allow_iframe: newVal,
													};
													setoptionData(optionsX);
												}}
												multiple={false}
											/>
										</div>
										<div className="flex  my-5  justify-between items-center">
											<label className="w-[400px]" htmlFor="">
												{__("Enable accordions preview", "accordions")}
											</label>
											<PGinputSelect
												val={optionData?.accordions_preview ?? "no"}
												className="!py-1 px-2 max-w-[200px] w-[180px]"
												options={[
													{ label: "No", value: "no" },
													{ label: "Yes", value: "yes" },
												]}
												onChange={(newVal) => {
													var optionsX = {
														...optionData,
														accordions_preview: newVal,
													};
													setoptionData(optionsX);
												}}
												multiple={false}
											/>
										</div>
										<div className="flex  my-5  justify-between items-center">
											<label className="w-[400px]" htmlFor="">
												{__("Open AI API Key", "accordions")}
											</label>

											<PGinputText
												label=""
												className="w-[180px]"
												value={optionData?.openaiApiKey ?? ""}
												onChange={(newVal) => {
													var optionsX = {
														...optionData,
														openaiApiKey: newVal,
													};
													setoptionData(optionsX);
												}}
											/>
										</div>
										<div className="flex  my-5  justify-between items-center">
											<label className="w-[400px]" htmlFor="">
												{__("License Key", "accordions")}
											</label>

											<PGinputText
												label=""
												className="w-[180px]"
												value={optionData?.licenseKey ?? ""}
												onChange={(newVal) => {
													var optionsX = {
														...optionData,
														licenseKey: newVal,
													};
													setoptionData(optionsX);
												}}
											/>
										</div>
									</div>
								</div>
							</Popover>
						)}
					</div>

					<div>
						<input
							type="text"
							className="w-72 !bg-slate-200 !rounded-none !border-2 !border-solid border-slate-400 text-sm !py-1 !px-2 font-mono"
							value={`[accordions_builder id="${id}"]`}
							onClick={() => {
								var str = `[accordions_builder id="${id}"]`;

								copyData(str);
							}}
						/>
					</div>

					{isLoading && (
						<div className="">
							<Spinner />
						</div>
					)}

					{pleaseUpdateX && (
						<div
							className="bg-slate-700 text-white px-5 py-2 rounded-sm cursor-pointer hover:bg-slate-600"
							onClick={(ev) => {
								onUpdate(true);
							}}>
							Save
						</div>
					)}
				</div>
			</div>

			<div className={`my-5 ${wrapper?.options?.class} `}>
				{items?.map((item, index) => {
					return (
						<Fragment key={index}>
							<div
								className={`accordion-header ${header.options.class} ${
									active == index ? "accordion-header-active" : ""
								}`}
								onClick={(ev) => {
									setToggled(!toggled);
									setactive(index == active ? 999 : index);
								}}>
								{labelCounter.options.position == "left" && (
									<span className={` accordion-label-counter`}>{index}</span>
								)}
								{icon.options.position == "left" && (
									<>
										{active != index && (
											<span
												className={` accordion-icon`}
												dangerouslySetInnerHTML={{ __html: iconHtml }}></span>
										)}
										{active == index && (
											<span
												className={` accordion-icon accordion-icon-toggle}`}
												dangerouslySetInnerHTML={{
													__html: iconToggleHtml,
												}}></span>
										)}
									</>
								)}
								{labelIcon.options.position == "beforeLabel" && (
									<span
										className={` accordion-label-icon`}
										dangerouslySetInnerHTML={{ __html: labelIconHtml }}></span>
								)}
								<div
									className={` accordion-header-label`}
									onClick={(e) => {
										return;
									}}>
									{labelCounter.options.position == "beforeLabelText" && (
										<span className={` accordion-label-counter`}>{index}</span>
									)}
									{labelIcon.options.position == "beforeLabelText" && (
										<span
											className={` accordion-label-icon`}
											dangerouslySetInnerHTML={{
												__html: labelIconHtml,
											}}></span>
									)}
									{item.headerLabel?.options.text.length > 0 ? (
										<>
											<span
												className={``}
												dangerouslySetInnerHTML={{
													__html: item?.headerLabel.options.text,
												}}></span>
										</>
									) : (
										"Start Writing..."
									)}
									{labelIcon.options.position == "afterLabelText" && (
										<span
											className={` accordion-label-icon`}
											dangerouslySetInnerHTML={{
												__html: labelIconHtml,
											}}></span>
									)}
									{labelCounter.options.position == "afterLabelText" && (
										<span className={` accordion-label-counter`}>{index}</span>
									)}
								</div>
								{labelIcon.options.position == "afterLabel" && (
									<span
										className={` accordion-label-icon`}
										dangerouslySetInnerHTML={{ __html: labelIconHtml }}></span>
								)}
								{labelCounter.options.position == "right" && (
									<span className={` accordion-label-counter`}>{index}</span>
								)}
								{icon.options.position == "right" && (
									<>
										{active != index && (
											<span
												className={` accordion-icon`}
												dangerouslySetInnerHTML={{ __html: iconHtml }}></span>
										)}
										{active == index && (
											<span
												className={` accordion-icon-toggle`}
												dangerouslySetInnerHTML={{
													__html: iconToggleHtml,
												}}></span>
										)}
									</>
								)}
							</div>
							{active == index && (
								<>
									<div
										className={`accordion-content`}
										dangerouslySetInnerHTML={{
											__html: item?.content.options.text,
										}}></div>
								</>
							)}
						</Fragment>
					);
				})}
			</div>
		</div>
	);
}

class AccordionsView extends Component {
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
		var {
			postData,
			id,
			isLoading,
			onChange,
			pleaseUpdate,
			onUpdate,
			addNotifications,
		} = this.props;

		return (
			<Html
				isLoading={isLoading}
				postData={postData}
				id={id}
				onUpdate={onUpdate}
				pleaseUpdate={pleaseUpdate}
				onChange={onChange}
				addNotifications={addNotifications}
				warn={this.state.showWarning}
			/>
		);
	}
}

export default AccordionsView;
