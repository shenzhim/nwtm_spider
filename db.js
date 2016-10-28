const mysql = require('mysql');
const pool = mysql.createPool({
	connectionLimit: 20,
	host: '127.0.0.1',
	user: 'root',
	password: '123456',
	database: 'product'
});

module.exports = {
	end: function() {
		pool.end(function(err) {
			if (err) {
				console.log("pool end error", err);
			} else {
				console.log("pool end success");
			}
		});
	},
	insert: function(param) {
		if (!param.sku) return;

		var val = [param.sku];
		val.push(param.name || '');
		val.push(Number(param.mprice) || 0);
		val.push(Number(param.sprice) || 0);
		val.push(param.status || '');
		val.push(param.reason || '');
		val.push(new Date());
		val.push(new Date());

		pool.getConnection(function(err, conn) {
			if (err) throw err;

			var query = conn.query('REPLACE INTO DATA (sku, name, marketprice, saleprice, status, reason, created, changed) VALUES (?,?,?,?,?,?,?,?);',
				val,
				function(err, result) {
					if (err) {
						console.log("query sql error", err, val);
					}
					conn.release();
				});
		});
	}
}