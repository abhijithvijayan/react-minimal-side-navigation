module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
		layers: ['components', 'utilities'],
  	content:['./source/**/*.tsx']
	},
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
}
