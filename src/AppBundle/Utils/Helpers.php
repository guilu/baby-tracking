<?php
/**
 * Created by PhpStorm.
 * User: diegobarrioh
 * Date: 24/8/15
 * Time: 13:26
 */

namespace AppBundle\Utils;

/**
 * Class Helpers
 *
 * @package AppBundle\Utils
 */
class Helpers
{

    /**
     * @param string $start
     * @param null   $end
     *
     * @return string
     */
    public function formatDateDiff($start, $end = null)
    {
        if (!($start instanceof \DateTime)) {
            $start = new \DateTime($start);
        }

        if ($end === null) {
            $end = new \DateTime();
        }

        if (!($end instanceof \DateTime)) {
            $end = new \DateTime($start);
        }

        $interval = $end->diff($start);
        $format   = array();
        if ($interval->y !== 0) {
            $format[] = "%y y";
        }
        if ($interval->m !== 0) {
            $format[] = "%m m";
        }
        if ($interval->d !== 0) {
            $format[] = "%d d";
        }
        if ($interval->h !== 0) {
            $format[] = "%h h";
        }
        if ($interval->i !== 0) {
            $format[] = "%i min.";
        }
        if ($interval->s !== 0 && !count($format)) {
            return "hace menos de 1 minuto";
        }

        // We use the two biggest parts
        if (count($format) > 1) {
            $format = array_shift($format)." y ".array_shift($format);
        } else {
            $format = array_pop($format);
        }

        $formatted = $interval->format($format);

        return ($start < $end) ? ('hace '.$formatted) : $formatted;
    }

    /**
     * @param string $born
     *
     * @return string
     */
    public function formatAge($born)
    {
        if (!($born instanceof \DateTime)) {
            $start = new \DateTime($born);
        } else {
            $start = $born;
        }

        $end = new \DateTime();

        $interval = $end->diff($start);
        $format   = array();
        if ($interval->y !== 0) {
            $format[] = '%y '.(($interval->y == 1) ? 'año' : 'años');
        }
        if ($interval->m !== 0) {
            $format[] = '%m '.(($interval->m == 1) ? 'mes' : 'meses');
        }
        if ($interval->d !== 0) {
            $format[] = '%d '.(($interval->d == 1) ? 'dia' : 'dias');
        }
        if ($interval->h !== 0) {
            $format[] = '%h '.(($interval->d == 1) ? 'hora' : 'horas');
        }
        if ($interval->i !== 0) {
            $format[] = '%i '.(($interval->i == 1) ? 'minutos' : 'minutos');
        }
        if ($interval->s !== 0) {
            $format[] = '%s '.(($interval->s == 1) ? 'segundos' : 'segundos');
        }


        // We use the two biggest parts
        $format = array_shift($format)." <br> ".array_shift($format)."<br>";

        return $interval->format($format);
    }

    /**
     * Comprueba si un array es associativo
     *
     * @param array $arr
     *
     * @return bool
     */
    public function isAssoc($arr)
    {
        return array_keys($arr) !== range(0, count($arr) - 1);
    }
}
