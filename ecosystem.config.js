module.exports = {
	apps: [
		{
			name: 'kps_server',
			script: './app.js',
			cron_restart: '0 */12 * * *',
		},
	],
}
