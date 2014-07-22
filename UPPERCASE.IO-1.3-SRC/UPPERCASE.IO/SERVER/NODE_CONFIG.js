/**
 * Node-side Configuration
 */
OVERRIDE(NODE_CONFIG, function(origin) {

	global.NODE_CONFIG = NODE_CONFIG = COMBINE_DATA({
		origin : origin,
		extend : {
			dbName : 'UPPERCASE_IO-testdb',
			dbUsername : 'test',
			dbPassword : 'test',
			isNotRequiringDBAuth : false,
			maxDataCount : 1000,
			securedUsername : 'test',
			securedPassword : 'test'
		}
	});
});
