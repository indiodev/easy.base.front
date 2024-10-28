import type { GroupBase, StylesConfig } from 'react-select';

export const Styles: StylesConfig<unknown, boolean, GroupBase<unknown>> = {
	input: (base) => ({
		...base,
		'& input': {
			color: '#FE7F03', // Cor do texto enquanto digita
		},
		'input:focus': {
			boxShadow: 'none',
			borderColor: '#FE7F03', // Cor da borda quando o input está focado
		},
	}),
	multiValue: (base) => ({
		...base,
		backgroundColor: '#FFF2E5', // Cor de fundo suave para valores selecionados
		borderRadius: '0.5rem',
		border: '1px solid #FE7F03',
		padding: '0.2rem 0.5rem',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '0.5rem',
	}),
	multiValueLabel: (base) => ({
		...base,
		whiteSpace: 'normal',
		overflow: 'visible',
		color: '#292B37',
	}),
	multiValueRemove: (base) => ({
		...base,
		color: '#FE7F03',
		cursor: 'pointer',
	}),
	control: (base, state) => ({
		...base,
		transition: 'border-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease',
		borderRadius: '1.5rem',
		backgroundColor: state.isFocused ? '#FFF2E5' : '#F0F0F5', // Cor de fundo ao focar
		paddingInline: '0.5rem',
		marginBottom: '0.6rem',
		boxShadow: state.isFocused
			? '0 0 0 2px rgba(254, 127, 3, 0.2)' // Sombra laranja ao focar
			: 'none',
		borderColor: state.isFocused ? '#FE7F03' : '#E8E8F0', // Borda laranja ao focar
		'&:hover': {
			borderColor: '#FE7F03', // Cor da borda ao passar o mouse
		},
		'&:hover .chevron-icon': {
			color: '#FE7F03',
		},
	}),
	option: (base, props) => ({
		...base,
		backgroundColor: props.isSelected ? '#FFF2E5' : undefined,
		paddingBlock: '1rem',
		borderBlock: '1px solid #f0f0f0',
		color: props.isSelected ? '#ff6f00' : '#292B37', // Cor do texto quando selecionado
		cursor: 'pointer',
		overflow: 'hidden',
		transition: 'background-color 0.2s ease',
		'&:hover': {
			backgroundColor: '#fdf3e9',
		},
	}),
	menu: (base) => ({
		...base,
		borderRadius: '1.5rem',
		boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Sombra no dropdown
		marginTop: '0.5rem',
		overflow: 'hidden',
	}),
	menuList: (provided) => ({
		...provided,
		maxHeight: '300px',
		overflowY: 'auto',
		'::-webkit-scrollbar': {
			display: 'none', // Oculta a barra de rolagem no Chrome
		},
		scrollbarWidth: 'none', // Oculta a barra de rolagem no Firefox
	}),
	placeholder: (base) => ({
		...base,
		color: '#888888', // Cor do placeholder
	}),
};
