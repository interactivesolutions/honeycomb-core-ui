/**
 * Finding Object size
 *
 * @param obj
 * @returns {number}
 */
Object.size = function (obj)
{
    var size = 0, key;
    for (key in obj)
    {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

/**
 *
 * Getting the outerHTML from jquery element.
 *
 * @param s
 * @returns {String}
 */
jQuery.fn.outerHTML = function (s)
{
    return (s)
        ? this.before (s).remove ()
        : jQuery ("<p>").append (this.eq (0).clone ()).html ();
};

/**
 * Removing item from array by value
 *
 * @credit http://stackoverflow.com/a/3955096/657451
 *
 * @returns {Array}
 */
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
