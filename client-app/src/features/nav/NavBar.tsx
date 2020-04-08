import React from "react";
import { Menu, Container, Button } from "semantic-ui-react";

interface IProps {
	OpenCreateForm: () => void;
}

export const NavBar: React.FC<IProps>= ({ OpenCreateForm }) => {
	return (
		<Menu fixed="top" inverted>
			<Container>
				<Menu.Item header>
					<img
						src="assets/logo.png"
						alt="reactivities-logo"
						style={{ marginRight: "10px" }}
					/>
					Reactivities
				</Menu.Item>
				<Menu.Item name="Activities" />
				<Menu.Item>
					<Button onClick={OpenCreateForm} positive content="Create Avtivity" />
				</Menu.Item>
			</Container>
		</Menu>
	);
};
