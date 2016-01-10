<?php
/**
 * Created by PhpStorm.
 * User: diegobarrioh
 * Date: 25/8/15
 * Time: 12:19
 */

namespace AppBundle\Controller;

use AppBundle\Entity\Event;
use AppBundle\Form\EventType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Class StatsController
 *
 * @package AppBundle\Controller
 *
 * @Route("/stats")
 */
class StatsController extends Controller
{
    /**
     * @return JsonResponse
     *
     * @Route("/update", name="stats-update")
     */
    public function getUpdateAction()
    {
        $profile = $this->profile();

        return new JsonResponse(array(
            'profile' => $profile,
            'diaper_graph' => $this->diaperGraph(),
            'diaper_stats' => $this->diaperStats(),
            'last_fed' => $this->lastFed(),
            'feed_time' => $this->feedTime(),
            'day_chart' => $this->dayChart($profile['sleeping']),
        ));
    }

    /**
     * @return array
     */
    private function profile()
    {
        $now = new \DateTime();
        $last = array();
        $eventTypeNames = array('Banyo', 'Leche', 'Panyal', 'Dormir');

        $em = $this->get('doctrine.orm.entity_manager');
        $eventRepo = $em->getRepository('AppBundle:Event');
        $eventTypeRepo = $em->getRepository('AppBundle:EventType');

        foreach ($eventTypeNames as $eventTypeName) {
            /** @var Event $lastEntry */
            $lastEntry = $eventRepo->findLastEventOfType($eventTypeRepo->findOneBy(array('name'=>$eventTypeName)));
            $last[strtolower($eventTypeName)] = array(
                'timestamp' => is_null($lastEntry) ? 0 : $lastEntry->getCreatedAt()->getTimestamp(),
                'time' => is_null($lastEntry) ? '' : $this->get('helpers')->formatDateDiff($lastEntry->getCreatedAt()),
                'type' => is_null($lastEntry) ? '' : $lastEntry->getSubType(),
                'value' => is_null($lastEntry) ? '' : $lastEntry->getValue(),
            );
        }

        return array(
            'age' => $this->get('helpers')->formatAge(new \DateTime('2015-12-25 14:09:00')),
            'sleeping' => ($last['dormir']['type'] == 'start'),
            'attributes' => array(
                'higiene' => 1.0 - (($now->getTimestamp() - $last['banyo']['timestamp']) / 3600 / 240),
                'hambre' => 1.0 - (($now->getTimestamp() - $last['leche']['timestamp']) / 3600 / 20),
                'vejiga' => 1.0 - (($now->getTimestamp() - $last['panyal']['timestamp']) / 3600 / 10),
                'energia' => 1.0 - (($now->getTimestamp() - $last['dormir']['timestamp']) / 3600 / 5),
            ),
        );
    }

    /**
     * Grafico de los pañales
     *
     * @return array
     */
    private function diaperGraph()
    {
        $oneWeekAgo = new \DateTime();
        $oneWeekAgo->sub(new \DateInterval('P7D'));

        $em                = $this->get('doctrine.orm.entity_manager');
        $eventTypePanyales = $em->getRepository('AppBundle:EventType')->findOneBy(array('name' => 'Panyal'));
        $diaperChanges = $em->getRepository('AppBundle:Event')->findGroupedByEventType($eventTypePanyales, $oneWeekAgo);

        $labels = array();
        $data   = array();
        foreach ($diaperChanges as $day) {
            $today     = new \DateTime();
            $yesterday = new \DateTime();
            $yesterday->sub(new \DateInterval('PT24H'));


            $datetime = \DateTime::createFromFormat('Y-m-d', $day['fecha']);

            if ($datetime->format('Y-m-d') == $today->format('Y-m-d')) {
                $formattedDate = 'Hoy';
            } elseif ($datetime->format('Y-m-d') == $yesterday->format('Y-m-d')) {
                $formattedDate = 'Ayer';
            } else {
                setlocale(LC_TIME, 'es_ES');
                $formattedDate = strftime('%A', $datetime->getTimestamp());
            }

            if (!in_array($formattedDate, $labels)) {
                $labels[] = $formattedDate;
            }

            $data[$day['subType']][$formattedDate] = $day['cuenta'];

        }

        if ($data == null) {
            $data['pipi'] = null;
            $data['caca'] = null;
            $data['pipi-caca'] = null;
        } else {
            if (!array_key_exists('pipi', $data)) {
                $data['pipi'] = array();
            }
            if (!array_key_exists('caca', $data)) {
                $data['caca'] = array();
            }
            if (!array_key_exists('pipi-caca', $data)) {
                $data['pipi-caca'] = array();
            }
        }

        return array(
            'labels'   => $labels,
            'datasets' => array(
                array(
                    'fillColor'        => 'rgba(255,255,255,0.0)',
                    'strokeColor'      => 'rgba(255,255,255,1.0)',
                    'pointColor'       => 'rgba(255,255,255,1.0)',
                    'pointStrokeColor' => '#FFF',
                    'data'             => $this->constructData(
                        $labels,
                        array($data['pipi'], $data['caca'], $data['pipi-caca'])
                    ),
                ),
                array(
                    'fillColor'        => 'rgba(200,200,200,0.0)',
                    'strokeColor'      => 'rgba(200,200,200,1.0)',
                    'pointColor'       => 'rgba(200,200,200,1.0)',
                    'pointStrokeColor' => '#FFF',
                    'data'             => $this->constructData($labels, $data['pipi']),
                ),
                array(
                    'fillColor'        => 'rgba(110,110,110,0.0)',
                    'strokeColor'      => 'rgba(110,110,110,1.0)',
                    'pointColor'       => 'rgba(110,110,110,1.0)',
                    'pointStrokeColor' => '#FFF',
                    'data'             => $this->constructData($labels, $data['caca']),
                ),
                array(
                    'fillColor'        => 'rgba(50,50,50,0.0)',
                    'strokeColor'      => 'rgba(50,50,50,1.0)',
                    'pointColor'       => 'rgba(50,50,50,1.0)',
                    'pointStrokeColor' => '#FFF',
                    'data'             => $this->constructData($labels, $data['pipi-caca']),
                ),
            ),
        );
    }

    /**
     * @return array
     */
    private function diaperStats()
    {
        $em = $this->get('doctrine.orm.entity_manager');
        $eventRepo = $em->getRepository('AppBundle:Event');
        $eventTypeRepo = $em->getRepository('AppBundle:EventType');

        $supplies = $eventTypeRepo->findOneBy(array('name'=>'Suministros'));
        $diapersPurchased = $eventRepo->sumEventValuesOfEventType($supplies);

        // Find used diapers
        $diapers = $eventTypeRepo->findOneBy(array('name'=>'Panyal'));
        $diapersUsed = $eventRepo->countEventsOfEventType($diapers);

        // Calculate available diapers
        $diapersAvailable = $diapersPurchased - $diapersUsed;

        // Find average used diapers last 48 hours
        $twoDaysAgo = new \DateTime();
        $twoDaysAgo->sub(new \DateInterval('PT48H'));

        $averageUsed = $eventRepo->countEventsOfEventTypeCreatedAfter($diapers, $twoDaysAgo);
        $diapersPerHour = $averageUsed / 48;

        $runOutDate = new \DateTime();

        if (($diapersPerHour != 0) && ($diapersAvailable > 0)) {
            $runOutDate->add(new \DateInterval('PT'.floor($diapersAvailable / $diapersPerHour).'H'));
        }
        // Return data
        setlocale(LC_TIME, 'es_ES');

            return array(
                'available' => $diapersAvailable,
                'used_per_day' => $diapersPerHour * 24,
                'run_out' => array(
                    'date' => strftime('%d de %B de %Y', $runOutDate->getTimestamp()),
                    'days' => $runOutDate->diff(new \DateTime())->days,
                ),
            );

    }

    /**
     * @return array
     */
    private function lastFed()
    {
        $em = $this->get('doctrine.orm.entity_manager');
        $eventRepo = $em->getRepository('AppBundle:Event');
        $eventtypeRepo = $em->getRepository('AppBundle:EventType');

        /** @var Event $last */
        $last = $eventRepo->findLastEventOfType($eventtypeRepo->findOneBy(array('name'=>'Leche')));

        $icon = "";
        if (!is_null($last)) {
            $icons = array(
                'izquierda' => 'fa fa-arrow-left',
                'derecha' => 'fa fa-arrow-right',
                'sacaleche' => 'fa fa-tint',
                'formula' => 'fa fa-magic',
            );

            $icon = $icons[$last->getSubType()];
        }

        return array(
            'formatted_time' => is_null($last) ? '' : $this->get('helpers')->formatDateDiff($last->getCreatedAt()),
            'timestamp' => is_null($last) ? '' : $last->getCreatedAt(),
            'type' => is_null($last) ? '' : $last->getSubType(),
            'value' => is_null($last) ? '' : $last->getValue(),
            'icon' => $icon,
        );
    }


    /**
     * @return array
     */
    private function feedTime()
    {
        // Find all feedings for last 24 hours
        $oneDayAgo = new \DateTime();
        $oneDayAgo->sub(new \DateInterval('PT24H'));

        $em = $this->get('doctrine.orm.entity_manager');
        $eventRepo = $em->getRepository('AppBundle:Event');
        $eventtypeRepo = $em->getRepository('AppBundle:EventType');

        $feedings = $eventRepo->findCreatedAfterOfTypeAndSubtype($oneDayAgo, $eventtypeRepo->findOneBy(array('name'=>'Leche')), 'formula');

        $timeBetween = array();
        $previous = null;

        foreach ($feedings as $feeding) {
            /** @var Event $feeding */
            /** @var Event $previous */
            if (is_null($previous)) {
                $previous = $feeding;
            } else {
                $timeBetween[] = $feeding->getCreatedAt()->getTimestamp() - $previous->getCreatedAt()->getTimestamp();
                $previous = $feeding;
            }
        }

        if (count($timeBetween) != 0) {
            $averageDiff = array_sum($timeBetween) / count($timeBetween);
        } else {
            $averageDiff = 0;
        }

        if (!is_null($previous)) {
            $nextFeed = $previous->getCreatedAt()->add(new \DateInterval('PT'.ceil($averageDiff).'S'));
        } else {
            $nextFeed = null;
        }

        return array(
            'average_diff' => $averageDiff / 3600,
            'next_feed' => $nextFeed,
            'next_feed_formatted' => ($nextFeed < new \DateTime()) ? 'pronto' : $this->get('helpers')->formatDateDiff($nextFeed),
        );
    }

    /**
     * Grafico para el dia
     * @param $isSleeping
     *
     * @return array
     */
    private function dayChart($isSleeping)
    {
        $start = new \DateTime('today midnight');

        $end = clone $start;
        $end->add(new \DateInterval('PT24H'));

        $em = $this->get('doctrine.orm.entity_manager');
        $eventRepo = $em->getRepository('AppBundle:Event');

        $events = $eventRepo->findCreatedAfter($start);

        $result = array();
        foreach ($events as $event) {
            /** @var Event $event */
            $percent = ($event->getCreatedAt()->getTimestamp() - $start->getTimestamp()) / (3600 * 24);

            if ($event->getEventType()->getName() == 'Dormir' && $event->getSubType() == 'end') {
                // Find last dormir start and update the the width
                for ($i = count($result) - 1; $i >= 0; $i--) {
                    if ($result[$i]['type'] == 'Dormir' && $result[$i]['subtype'] == 'start') {
                        $percent = ($event->getCreatedAt()->getTimestamp() - $result[$i]['timestamp']) / (3600 * 24);
                        $result[$i]['width'] = $percent;
                        $result[$i]['value'] = floor(($event->getCreatedAt()->getTimestamp() - $result[$i]['timestamp']) / 60);
                        break;
                    }
                }
            } else {
                $width = 0.01;

                if ($event->getEventType()->getName() == 'Leche') {
                    if ($event->getSubType() == 'left' || $event->getSubType() == 'right') {
                        $width = 0.005 * ($event->getValue() / 8);
                    } else {
                        $width = 0.005 * $event->getValue();
                    }
                }

                $result[] = array(
                    'type' => $event->getEventType()->getName(),
                    'timestamp' => $event->getCreatedAt()->getTimestamp(),
                    'time' => $event->getCreatedAt()->format('h:i'),
                    'time_percent' => $percent,
                    'width' => $width,
                    'subtype' => $event->getSubType(),
                    'value' => $event->getValue(),
                );
            }
        }

        // If sleeping, set last "start" dormir to end at current timestamp in the output
        if ($isSleeping) {
            // Find last dormir start and update the the width
            $now = new \DateTime();
            for ($i = count($result) - 1; $i > 0; $i--) {
                if ($result[$i]['type'] == 'Dormir' && $result[$i]['subtype'] == 'start') {
                    $percent = ($now->getTimestamp() - $result[$i]['timestamp']) / (3600 * 24);
                    $result[$i]['width'] = $percent;
                    break;
                }
            }
        }

        return $result;
    }

    /**
     * @param $labels
     * @param $data
     *
     * @return array
     */
    private function constructData($labels, $data)
    {
        $result = array();

        foreach ($labels as $label) {
            $sum = 0;

            if (!$this->get('helpers')->isAssoc($data)) {
                foreach ($data as $entry) {
                    if (isset($entry[$label])) {
                        $sum += $entry[$label];
                    }
                }
            } else {
                if (isset($data[$label])) {
                    $sum = $data[$label];
                }
            }

            $result[] = $sum;
        }

        return $result;
    }
}
