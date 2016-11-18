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