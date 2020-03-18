/*!
 * ResponsiveGauge
 * version : 0.1.0
 * license : MIT
 * authors : Mikaël Restoux, Matt Magoffin (http://bl.ocks.org/msqr/3202712)
 *
 */
var ResponsiveGaugeFactory = function(t, e) {
		'use strict';
		'undefined' == typeof d3 && (this.d3 = t), 'undefined' == typeof numbro && (this.numbro = e);
		var r = numbro.cultureData(),
			a = { thousands: 1e3, decimal: 1.1 };
		for (var n in a) {
			var i = a[n].toLocaleString().replace(/\d/g, '');
			0 !== i.length && (r.delimiters[n] = i);
		}
		var o =
				'.gauge-container{display:inline-block;position:relative}.gauge-container .gauge{position:absolute;top:0;left:0}.gauge-ie-fix{display:block;height:100%;width:100%;visibility:hidden}.gauge{display:inline-block;overflow:visible;height:100%;max-width:100%}.gauge-needle{stroke:#cf4814;fill:transparent}.gauge-filament{stroke:#000}.gauge-filler{fill:#d50000}.gauge-arc{fill:#ddd}.gauge-arc-border{stroke:#ccc;stroke-width:.3px}.gauge text{fill:#333}.gauge-label text{text-anchor:middle;font-weight:700;font-size:4px}.wide-gauge .gauge-label text{font-size:8px}.gauge-label g:first-child text{text-anchor:start}.gauge-label g:last-child text{text-anchor:end}.gauge-value text{font-size:12px;text-anchor:middle}.wide-gauge .gauge-value text{font-size:24px}.unit{font-size:.7em}',
			l = 6,
			s = 2,
			u = 100,
			d = 40,
			f = numbro(),
			c = function(t, e) {
				function r(t, e) {
					0 === t.decimalsMax
						? (this[e] = t.mantissaMax + ',.a')
						: (this[e] = t.mantissaMax + ',.[' + new Array(t.decimalsMax + 1).join('0') + ']a');
				}
				var a, n;
				return (
					e
						? ((a = 'LABEL_FORMAT'), (n = this.labels), void 0 === this.LABEL_FORMAT && r.call(this, n, a))
						: ((a = 'VALUE_FORMAT'), (n = this.value), void 0 === this.VALUE_FORMAT && r.call(this, n, a)),
					f.set(t).format(this[a])
				);
			},
			g = {
				ring: {
					shift: 3,
					width: 7,
					minAngle: -90,
					maxAngle: 90,
					sectorsNumber: 5,
					border: !1,
					colors: !1,
					startColor: '#ffebee',
					endColor: '#810301'
				},
				pointer: {
					type: 'needle',
					slowness: 200,
					needleLength: 90,
					filamentLength: 2,
					fillerWidth: null,
					fillerShift: null,
					colors: !1,
					startColor: '#ffebee',
					endColor: '#810301'
				},
				data: { min: 0, max: 100, value: 0 },
				labels: {
					number: null,
					formatter: function(t) {
						return c.call(this, t, !0);
					},
					mantissaMax: 4,
					decimalsMax: 0,
					shift: 0
				},
				value: {
					show: !0,
					shift: 22,
					formatter: function(t) {
						return c.call(this, t, !1);
					},
					mantissaMax: 4,
					decimalsMax: 0,
					unit: ''
				}
			},
			p = function(t, e) {
				function r(t) {
					return t * Math.PI / 180;
				}
				function a() {
					if ((null === q.labels.number && (q.labels.number = q.ring.sectorsNumber), 0 === q.labels.number))
						return [];
					var t = (q.data.max - q.data.min) / (q.labels.number - 1),
						e = d3.range(q.data.min, q.data.max, t);
					return e.push(q.data.max), e;
				}
				function n(t, e, r) {
					for (var a in e)
						if (e.hasOwnProperty(a)) {
							var i = e[a];
							'object' == typeof i && i.constructor !== Array
								? (void 0 === t[a] && (t[a] = {}), n(t[a], i, r[a]))
								: ((t[a] = i), void 0 === r[a] && console.warn('Config property ' + a + ' is unknwon'));
						}
				}
				function i(t) {
					(q = JSON.parse(JSON.stringify(g))),
						(q.labels.formatter = g.labels.formatter),
						(q.value.formatter = g.value.formatter),
						n(q, t, g),
						(q.FORMAT = void 0),
						(q.labels.formatter = q.labels.formatter.bind(q)),
						(q.value.formatter = q.value.formatter.bind(q));
				}
				function o(t) {
					i(t),
						(w = q.ring.maxAngle - q.ring.minAngle),
						v(),
						(L = d3.scale.linear().range([ 0, 1 ]).domain([ q.data.min, q.data.max ])),
						(E = a()),
						m(),
						(O = c(
							function(t, e) {
								var a = t * e,
									n = 0 === e ? 0 : 0.5;
								return r(q.ring.minAngle + a * w - n);
							},
							function(t, e) {
								var a = t * (e + 1);
								return r(q.ring.minAngle + a * w);
							},
							q.ring.width,
							q.ring.shift
						)),
						q.ring.border && (j = c(q.ring.minAngle, q.ring.maxAngle, q.ring.width, q.ring.shift)),
						'filler' === q.pointer.type &&
							(null === q.pointer.fillerWidth && (q.pointer.fillerWidth = q.ring.width),
							null === q.pointer.fillerShift && (q.pointer.fillerShift = q.ring.shift));
				}
				function f(t) {
					return Array.apply(null, Array(t)).map(Number.prototype.valueOf, 1 / t);
				}
				function c(t, e, a, n) {
					return (
						(t = 'number' == typeof t ? r(t) : t),
						(e = 'number' == typeof e ? r(e) : e),
						d3.svg.arc().innerRadius(G - a - n).outerRadius(G - n).startAngle(t).endAngle(e)
					);
				}
				function m() {
					var t = q.ring;
					t.colors.constructor === Array
						? ((F = f(t.colors.length)),
							(N = function(e) {
								var r = Math.floor(e * t.colors.length);
								return t.colors[r];
							}))
						: t.colors
							? ((F = f('gradient' === t.colors ? d : t.sectorsNumber)),
								(N = d3.interpolateHsl(d3.rgb(t.startColor), d3.rgb(t.endColor))))
							: (F = f(1));
				}
				function h() {
					var t = JSON.parse(JSON.stringify(q));
					return Object.freeze(t), t;
				}
				function v() {
					function t(t) {
						return [ e(a + t), e(n + t) ];
					}
					function e(t) {
						return i * Math.sin(r(t));
					}
					for (
						var a = q.ring.minAngle,
							n = q.ring.maxAngle,
							i = G - Math.min(q.ring.shift, q.pointer.fillerShift, q.labels.shift),
							o = 0,
							s = 0,
							u = 0,
							d = 0,
							f = Math.floor(a / 90),
							c = Math.floor(n / 90),
							g = f;
						c >= g;
						g++
					)
						switch (g % 4) {
							case 0:
								u = i;
								break;
							case 1:
								s = i;
								break;
							case 2:
								d = i;
								break;
							case 3:
								o = i;
						}
					var p = t(0),
						m = t(-90);
					(o = Math.abs(Math.min(-o, p[0], p[1]))),
						(s = Math.max(s, p[0], p[1])),
						(u = Math.abs(Math.min(-u, m[0], m[1]))),
						(d = Math.max(d, m[0], m[1])),
						(B = o + s + 2 * l),
						(J = u + d + 2 * l);
					var h = u + l,
						v = o + l,
						b = 3 * i + 4 * l;
					J + B > b && ((k = !0), (B += 2 * l), (J += 2 * l), (h += l), (v += l)),
						(_ = 'translate(' + v + ',' + h + ')');
				}
				function b(t) {
					o(t), y();
					var e = R.append('g').attr('class', 'gauge-arc').attr('transform', _),
						r = e.selectAll('path').data(F).enter().append('path').attr('d', O);
					q.ring.colors &&
						r.attr('fill', function(t, e) {
							return N(t * e);
						}),
						q.ring.border &&
							e.append('path').attr('fill', 'none').attr('class', 'gauge-arc-border').attr('d', j);
					var a = d3.svg.line().interpolate('monotone'),
						n = R.append('g').attr('class', 'gauge-pointer gauge-' + q.pointer.type).attr('transform', _);
					if ('filler' === q.pointer.type) C = n.append('path');
					else if ('needle' === q.pointer.type)
						(C = n.data([ [ [ 0, -s ], [ 0, -q.pointer.needleLength / 2 ] ] ]).append('path').attr('d', a)),
							n.append('circle').attr('r', s);
					else if ('filament' === q.pointer.type) {
						var i = G - q.ring.shift - q.ring.width - q.pointer.filamentLength,
							l = G - q.ring.shift + q.pointer.filamentLength;
						C = n.data([ [ [ 0, -i ], [ 0, -l ] ] ]).append('path').attr('d', a);
					}
					R.append('g')
						.attr('class', 'gauge-label')
						.attr('transform', _)
						.selectAll('text')
						.data(E)
						.enter()
						.append('g')
						.attr('transform', function(t) {
							var e = L(t),
								r = q.ring.minAngle + e * w;
							return 'rotate(' + r + ') translate(0,' + (q.labels.shift - G) + ')';
						})
						.append('text')
						.text(q.labels.formatter);
					if (q.value.show) {
						var u = q.value.shift,
							d = q.ring.minAngle + Math.abs(w) / 2;
						k && ((u = 0), (d = 0));
						var f = 'translate(0, ' + -u + ')',
							c = R.append('g')
								.attr('class', 'gauge-value')
								.attr('transform', _ + ' rotate(' + d + ')')
								.append('g')
								.attr('transform', f + ' rotate(' + -d + ')')
								.append('text'),
							g = q.value.unit ? '0' : '0.4em';
						(S = c.append('tspan').attr('dy', g)),
							c.append('tspan').text(q.value.unit).attr('class', 'unit').attr('x', 0).attr('dy', '1em');
					}
				}
				function y() {
					(T = d3.select(t)),
						window.navigator.userAgent.match(/(MSIE|Trident|Edge)/) &&
							(T.classed('gauge-container', !0),
							T.append('canvas').attr({ class: 'gauge-ie-fix', width: B, height: J }),
							A()),
						(R = T.classed('wide-gauge', k)
							.append('svg:svg')
							.attr('class', 'gauge')
							.attr('viewBox', '0 0 ' + B + ' ' + J)
							.attr('preserveAspectRatio', 'xMinYMin meet'));
				}
				function A() {
					function t(t, e) {
						var r = null;
						return function() {
							clearTimeout(r),
								(r = setTimeout(function() {
									t();
								}, e));
						};
					}
					p.ieListenerSet ||
						(window.addEventListener(
							'resize',
							t(function() {
								for (var t = document.querySelectorAll('canvas'), e = 0; e < t.length; ++e) {
									var r = t[e];
									r.setAttribute('height', r.getAttribute('height'));
								}
							}, 250)
						),
						(p.ieListenerSet = !0));
				}
				function x() {
					var t = q.pointer,
						e = Math.max(q.data.value, q.data.min);
					e = Math.min(e, q.data.max);
					var r = L(e),
						a = q.ring.minAngle + r * w;
					if ('filler' === t.type) {
						var n = null;
						if (t.colors.constructor === Array) {
							var i = Math.floor(r * t.colors.length);
							n = t.colors[i];
						} else
							'gradient' === t.colors &&
								(n = d3.interpolateHsl(d3.rgb(t.startColor), d3.rgb(t.endColor))(r));
						var o = c(q.ring.minAngle, a, t.fillerWidth, t.fillerShift);
						C.attr('d', o).attr('fill', n);
					} else C.transition().duration(t.slowness).ease('elastic').attr('transform', 'rotate(' + a + ')');
				}
				function M(t, e) {
					(q.data.value = void 0 === t ? 0 : t), x(), q.value.show && S.text(q.value.formatter(q.data.value));
				}
				var w,
					L,
					S,
					T,
					R,
					C,
					O,
					j,
					E,
					F,
					N,
					_,
					q = {},
					G = u / 2,
					k = !1,
					B = 0,
					J = 0;
				return b(e), M(q.data.value), { update: M, getConfig: h, container: T };
			};
		p.config = g;
		var m = document.createElement('style');
		if (
			((m.type = 'text/css'),
			(m.innerHTML = o),
			document.getElementsByTagName('head')[0].appendChild(m),
			'undefined' != typeof module && module.exports)
		)
			module.exports = p;
		else {
			if ('undefined' != typeof requirejs) return p;
			this.ResponsiveGauge = p;
		}
	},
	localThis = 'undefined' == typeof window ? this : window;
if ('undefined' != typeof module && module.exports) {
	var _d3 = require('d3'),
		_numbro = require('numbro');
	ResponsiveGaugeFactory.call(localThis, _d3, _numbro);
} else if ('undefined' != typeof requirejs) {
	var protocol = document.location.protocol;
	(protocol = 'file:' === protocol ? 'http:' : protocol),
		requirejs.config({
			paths: {
				d3: protocol + '//cdn.jsdelivr.net/d3js/3.5.16/d3.min',
				numbro: protocol + '//cdnjs.cloudflare.com/ajax/libs/numbro/1.7.1/numbro.min'
			}
		}),
		define([ 'd3', 'numbro' ], function(t, e) {
			return ResponsiveGaugeFactory.call(localThis, t, e);
		});
} else ResponsiveGaugeFactory.call(localThis);
