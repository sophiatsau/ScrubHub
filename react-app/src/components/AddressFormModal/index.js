import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { signUp } from "../../store/session";
import "./AddressForm.css";

function AddressFormModal() {
	const dispatch = useDispatch();
	const [address, setAddress] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	const [zipCode, setZipCode] = useState("");
	const [errors, setErrors] = useState([]);
	const { closeModal } = useModal();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const data = await dispatch(signUp({address, city, state, zipCode}));
		if (data) {
			setErrors(data);
		} else {
			closeModal();
		}
	};

	return (
		<>
			<h1>Enter Your Address</h1>
			<form onSubmit={handleSubmit}>
				<ul>
					{errors.map((error, idx) => (
						<li key={idx}>{error}</li>
					))}
				</ul>
				<label>
					Address
					<input
						type="text"
						value={address}
						onChange={(e) => setAddress(e.target.value)}
						placeholder="Optional, required for delivery"
					/>
				</label>
				<label>
					City
					<input
						type="text"
						value={city}
						onChange={(e) => setCity(e.target.value)}
					/>
				</label>
				<label>
					State
					<input
						type="text"
						value={state}
						onChange={(e) => setState(e.target.value)}
					/>
				</label>
				<label>
					Zip Code
					<input
						type="text"
						value={zipCode}
						onChange={(e) => setZipCode(e.target.value)}
						required
						placeholder="XXXXX or XXXXX-XXXX"
					/>
				</label>
				<button type="submit">Update</button>
			</form>
		</>
	);
}

export default AddressFormModal;
